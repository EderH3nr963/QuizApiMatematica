import { Router } from "express";
import {
  startQuizController,
  finishQuizController,
} from "../controllers/QuizController";
import { authValidator } from "../middlewares/authValidator";

const router = Router();

router.use(authValidator);

router.post("/start", startQuizController);
router.post("/finish", finishQuizController);

export default router;
