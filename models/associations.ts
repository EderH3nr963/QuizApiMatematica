import User from "./User";
import Quest from "./Quest";
import QuizAttempt from "./QuizAttempt";

User.hasMany(QuizAttempt, {
  foreignKey: "id_user",
  as: "attempts",
});

QuizAttempt.hasOne(User, {
  foreignKey: "id_user",
  as: "user",
});
