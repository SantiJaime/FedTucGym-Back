import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import pool from "./database/db.config";
import dotenv from "dotenv";

import userRouter from "./routes/users.routes";
import tournamentsRouter from "./routes/tournaments.routes";
import membersRouter from "./routes/members.routes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser(COOKIE_SECRET));

app.use("/users", userRouter);
app.use("/tournaments", tournamentsRouter);
app.use("/members", membersRouter);

pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("✅ Conexión a PostgreSQL exitosa");
  })
  .catch((err) => {
    console.error("❌ Error al conectar a PostgreSQL:", err);
  });

app.listen(PORT, () => {
  console.log("Server running on http://localhost:3000");
});
