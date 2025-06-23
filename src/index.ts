import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import pool from "./database/db.config";
import cron from "node-cron";

import userRouter from "./routes/users.routes";
import tournamentsRouter from "./routes/tournaments.routes";
import membersRouter from "./routes/members.routes";
import { env } from './config/env';
import { borrarInscripcionesSinPago } from "./services/members.service";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser(env.COOKIE_SECRET));

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

  cron.schedule("0 2 * * *", async () => {
  try {
    await borrarInscripcionesSinPago();
    console.log("Inscripciones no pagas eliminadas automáticamente");
  } catch (error) {
    console.error("Error al limpiar inscripciones no pagas:", error);
  }
});

app.listen(env.PORT, () => {
  console.log("Server running on http://localhost:3000");
});
