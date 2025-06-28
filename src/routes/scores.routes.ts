import { Router } from "express";
import { postPuntaje } from "../controllers/scores.controller";

const router = Router();

router.post("/", postPuntaje);

export default router;