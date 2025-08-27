import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import pool from "./database/db.config";
import cron from "node-cron";
import userRouter from "./routes/users.routes";
import tournamentsRouter from "./routes/tournaments.routes";
import membersRouter from "./routes/members.routes";
import puntajesRouter from "./routes/scores.routes";

import { env } from "./config/env";
import { borrarInscripcionesSinPago } from "./services/members.service";
import { actualizarCategoriasMiembros } from "./services/members.service";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://torneos-fedtucgim.vercel.app",
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser(env.COOKIE_SECRET));

app.use("/users", userRouter);
app.use("/tournaments", tournamentsRouter);
app.use("/members", membersRouter);
app.use("/puntajes", puntajesRouter);

pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("✅ Conexión a PostgreSQL exitosa");
  })
  .catch((err) => {
    console.error("❌ Error al conectar a PostgreSQL:", err);
  });

cron.schedule("* 2 * * *", async () => {
  try {
    await borrarInscripcionesSinPago();
    console.log("Inscripciones no pagas eliminadas automáticamente");
  } catch (error) {
    console.error("Error al limpiar inscripciones no pagas:", error);
  }
});

cron.schedule("0 2 1 1 *", async () => {
  try {
    await actualizarCategoriasMiembros();
    console.log("Categorías de miembros actualizadas automáticamente");
  } catch (error) {
    console.error("Error al actualizar categorías de miembros:", error);
  }
});

app.listen(env.PORT, () => {
  console.log("Server running on http://localhost:3000");
});
