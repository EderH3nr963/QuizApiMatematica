import Redis from "ioredis";
import { Quest, QuizAttempt } from "../models";

const redisClient = new Redis();

export const startQuiz = async (currentUserId: number) => {
  const allQuests = await Quest.findAll({ limit: 20 });

  const questsWithoutAnswers = allQuests.map((quest) => {
    const { correct_answer_index, ...rest } = quest.get();
    return rest;
  });

  await redisClient.hmset(`start_quiz:user:${currentUserId}`, {
    start_time: Date.now().toString(),
    quests: JSON.stringify(allQuests),
    correct_responses: "0",
    score: "0",
  });
  await redisClient.expire(
    `start_quiz:user:${currentUserId}`,
    1000 * 60 * 60 * 2
  );

  return {
    status: "success",
    data: {
      quests: questsWithoutAnswers,
    },
  };
};

export const finishQuiz = async (
  currentUserId: number,
  userResponses: number[]
) => {
  const redisKey = `start_quiz:user:${currentUserId}`;
  const quizData = await redisClient.hgetall(redisKey);

  if (!quizData || !quizData.quests) {
    throw new Error("Quiz não encontrado ou expirado.");
  }

  const originalQuests = JSON.parse(quizData.quests) as Quest[];
  let correctCount = 0;
  let totalScore = 0;
  const duration = Date.now() - Number(quizData.start_time);

  originalQuests.forEach((quest, index) => {
    const correctIndex = Number(quest.correct_answer_index);
    const userAnswer = userResponses[index];

    if (typeof userAnswer === "number" && userAnswer === correctIndex) {
      correctCount++;
      totalScore += 10 * (quest.peso || 1); // peso padrão = 1 se não existir
    }
  });

  // Limpa o quiz do Redis após finalizar
  await redisClient.del(redisKey);

  await QuizAttempt.create({
    duration,
    id_user: currentUserId,
    score: totalScore,
    totalQuestions: originalQuests.length,
    correctAnswers: correctCount,
  });

  return {
    status: "success",
    data: {
      totalQuestions: originalQuests.length,
      correctAnswers: correctCount,
      score: totalScore,
      duration,
      percentage: ((correctCount / originalQuests.length) * 100).toFixed(2),
    },
  };
};
