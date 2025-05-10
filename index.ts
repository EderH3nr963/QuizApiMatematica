import express from "express";
import dotenv from "dotenv";

const app = express();

dotenv.config();
app.use(express.json());

import AuthRoutes from "./routes/AuthRoutes";
import QuizRoutes from "./routes/QuizRoutes";

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/quiz", QuizRoutes);

app.listen(3000, "0.0.0.0", () => console.log("Server Rodando"));
