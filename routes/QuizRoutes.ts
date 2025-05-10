import { Router } from "express";
import {
  startQuizController,
  finishQuizController,
} from "../controllers/QuizController";

const router = Router();

router.post("/start", startQuizController);
router.post("/finish", finishQuizController);

export default router;
