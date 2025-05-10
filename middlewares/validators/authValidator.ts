import { body } from "express-validator";

export const loginValidator = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("A senha é obrigatória"),
];

export const verify2faValidator = [
  body("email").isEmail().withMessage("Email inválido"),
  body("code")
    .isLength({ min: 6, max: 6 })
    .withMessage("O código deve ter 6 dígitos")
    .isNumeric()
    .withMessage("O código deve conter apenas números"),
];

export const resend2faValidator = [
  body("email").isEmail().withMessage("Email inválido"),
];

export const registerValidator = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,17}$/)
    .withMessage(
      "A senha deve ter entre 8 e 17 caracteres, incluindo letras, números e pelo menos um caractere especial (@$!%*?&)"
    ),
  body("name").notEmpty().withMessage("O nome é obrigatório"),
];
