import { Router } from "express";
import {
  loginController,
  verify2faLoginController,
  resend2faLoginController,
  registerController,
} from "../controllers/AuthController";

import {
  loginValidator,
  verify2faValidator,
  resend2faValidator,
  registerValidator,
} from "../middlewares/validators/authValidator";

const router = Router();

router.post("/login", loginValidator, loginController);
router.post("/login/verify-2fa", verify2faValidator, verify2faLoginController);
router.post("/login/resend-2fa", resend2faValidator, resend2faLoginController);
router.post("/register", registerValidator, registerController);

export default router;
