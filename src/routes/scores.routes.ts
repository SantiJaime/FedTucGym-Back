import { Router } from "express";
import { getAllScores, getScoresByTournament, postPuntaje } from "../controllers/scores.controller";

const router = Router();

router.get("/", getAllScores);
router.get("/:tid", getScoresByTournament);
router.post("/:mid/tournament/:tid", postPuntaje);

export default router;