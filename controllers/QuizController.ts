import { Request, Response } from "express";
import * as quizService from "../services/QuizService"; // ajuste conforme o caminho real

export const startQuizController = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user?.id;

    const result = await quizService.startQuiz(currentUserId);
    res.status(200).json(result);
    return;
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
    return;
  }
};

export const finishQuizController = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user?.id;

    const { responses } = req.body;
    if (!Array.isArray(responses) || responses.length < 20) {
      res
        .status(400)
        .json({ status: "error", message: "Respostas inválidas." });
      return;
    }

    const result = await quizService.finishQuiz(currentUserId, responses);
    res.status(200).json(result);
    return;
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
    return;
  }
};
