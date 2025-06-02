import express from "express";
import usersRouter from "./routes/users.routes";
import torneosRouter from "./routes/torneos.routes";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import pool from "./db/db";

const app = express();

const PORT = process.env.PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser(COOKIE_SECRET));

app.use("/users", usersRouter);
app.use("/torneos", torneosRouter);

app.listen(PORT, () => {
    console.log("Server running on http://localhost:3000");
});

// Prueba de conexión al iniciar el servidor
pool.query("SELECT NOW()")
  .then(() => {
    console.log("✅ Conexión a PostgreSQL exitosa");
  })
  .catch((err) => {
    console.error("❌ Error al conectar a PostgreSQL:", err);
  });