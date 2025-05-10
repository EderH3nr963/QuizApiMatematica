import { Request, Response } from "express";
import {
  loginService,
  resend2faLoginService,
  verify2faLoginService,
  registerService,
} from "../services/AuthService";
import { validationResult } from "express-validator";

export const loginController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: "error", errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    const result = await loginService(email, password);
    res.status(200).json(result);
    return;
  } catch (err: any) {
    res.status(401).json({ status: "error", message: err.message });
    return;
  }
};

export const verify2faLoginController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: "error", errors: errors.array() });
      return;
    }

    const { email, code } = req.body;

    const result = await verify2faLoginService(email, code);
    res.status(200).json(result);
    return;
  } catch (err: any) {
    res.status(401).json({ status: "error", message: err.message });
    return;
  }
};

export const resend2faLoginController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: "error", errors: errors.array() });
      return;
    }

    const result = await resend2faLoginService(req.body.email);
    res.status(200).json(result);
    return;
  } catch (err: any) {
    res.status(429).json({ status: "error", message: err.message });
    return;
  }
};

export const registerController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: "error", errors: errors.array() });
      return;
    }

    const userData = req.body;

    const result = await registerService(userData);
    res.status(201).json(result);
    return;
  } catch (err: any) {
    res.status(400).json({ status: "error", message: err.message });
    return;
  }
};
