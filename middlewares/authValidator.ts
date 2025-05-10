import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware para validar o JWT
export const authValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Verificando se o token está no cabeçalho Authorization
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({
      status: "error",
      message: "Acesso não autorizado. Token não fornecido.",
    });
    return;
  }

  try {
    // Verificando a validade do token usando a chave secreta
    const decoded = jwt.verify(
      token,
      process.env.SECRET_JWT || "morangoEbanana"
    ) as { userId: number };

    // Adicionando o ID do usuário ao objeto request para que possa ser acessado nas próximas rotas
    (req as any).userId = decoded.userId;

    // Chama o próximo middleware ou controlador
    next();
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: "Token inválido ou expirado.",
    });
    return;
  }
};
