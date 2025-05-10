import Redis from "ioredis";
import { User } from "../models";
import sendEmail from "../utils/sendMail";
import jwt from "jsonwebtoken";

const redisClient = new Redis();
const CODE_EXPIRATION_TIME = 1000 * 60 * 15; // 15 minutos

// Função principal de login
export const loginService = async (email: string, password: string) => {
  // Validação do e-mail e senha
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.validPassword(password))) {
    throw new Error("Email ou senha inválidos");
  }

  // Remover a senha do objeto antes de armazená-lo
  const { password: _, ...userWithoutPassword } = user.get();

  if (user.is2fa) {
    const code = Math.floor(Math.random() * (999999 - 100000) + 100000);
    const html = `
      <div style="font-family: sans-serif; text-align: center;">
        <h2>Verificação de E-mail</h2>
        <p>Seu código de verificação é:</p>
        <h1 style="letter-spacing: 5px;">${code}</h1>
        <p>Esse código expira em 15 minutos.</p>
      </div>
    `;

    await redisClient.hmset(`user:2fa:login:${email}`, {
      code: code.toString(),
      user: JSON.stringify(userWithoutPassword),
      time: Date.now(),
    });
    await redisClient.expire(`user:2fa:login:${email}`, CODE_EXPIRATION_TIME);

    await sendEmail(email, "2FA login", html);

    return {
      status: "2fa_required",
      message: "Verificação de 2 fatores ativa",
    };
  }

  const token = jwt.sign(
    { userId: user.id_user },
    process.env.SECRET_JWT || "morangoEbanana",
    { expiresIn: "24h" }
  );

  return {
    status: "success",
    message: "Login realizado com sucesso",
    data: { user: userWithoutPassword, token },
  };
};

// Função para re-enviar o código de verificação 2FA
export const resend2faLoginService = async (email: string) => {
  const codeRedis = await redisClient.hget(`user:2fa:login:${email}`, "code");
  const time = await redisClient.hget(`user:2fa:login:${email}`, "time");

  if (!codeRedis) {
    throw new Error("Tempo de login expirado!");
  }

  if (Date.now() - Number(time) < 30 * 1000) {
    throw new Error("Muitas requisições de reenvio de código");
  }

  const code = Math.floor(Math.random() * (999999 - 100000) + 100000);
  const html = `
    <div style="font-family: sans-serif; text-align: center;">
      <h2>Verificação de E-mail</h2>
      <p>Seu código de verificação é:</p>
      <h1 style="letter-spacing: 5px;">${code}</h1>
      <p>Esse código expira em 15 minutos.</p>
    </div>
  `;

  await redisClient.hset(`user:2fa:login:${email}`, "code", code.toString());

  await sendEmail(email, "2FA login", html);

  return {
    status: "success",
    message: "Código de verificação re-enviado",
  };
};

// Funcao de verificação de código
export const verify2faLoginService = async (email: string, code: string) => {
  const codeRedis = await redisClient.hget(`user:2fa:login:${email}`, "code");
  const userJson = await redisClient.hget(`user:2fa:login:${email}`, "user");

  if (!codeRedis || !userJson || codeRedis !== code)
    throw new Error("O código informado está incorreto ou expirado.");

  const user = JSON.parse(userJson);

  await redisClient.del(`user:2fa:login:${email}`);

  const token = jwt.sign(
    { userId: user.id_user },
    process.env.SECRET_JWT || "morangoEbanana",
    { expiresIn: "24h" }
  );

  return {
    status: "success",
    message: "Login realizado com sucesso",
    data: { user: user, token },
  };
};

export const registerService = async (userCreate: any) => {
  const user = await User.create(userCreate);

  // Remover a senha do objeto antes de armazená-lo
  const { password: _, ...userWithoutPassword } = user.get();

  const token = jwt.sign(
    { userId: user.id_user },
    process.env.SECRET_JWT || "morangoEbanana",
    { expiresIn: "24h" }
  );

  return {
    status: "success",
    message: "Cadastro realizado com sucesso",
    data: { user: userWithoutPassword, token },
  };
};
