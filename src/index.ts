import express from "express";
import userRouter from "./routes/users.routes";
import tournamentsRouter from "./routes/tournaments.routes";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import pool from "./db/db";
import dotenv from "dotenv";


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
