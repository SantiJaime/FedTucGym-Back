import { Router } from "express";
import {
  getAllScores,
  getScoresByCategoryAndLevel,
  getScoresByGym,
  getScoresByTournament,
  postPuntaje,
} from "../controllers/scores.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  authMiddleware(["Administrador", "Gimnasio", "Juez"]),
  getAllScores
);
router.get(
  "/:tid",
  authMiddleware(["Administrador", "Gimnasio", "Juez"]),
  getScoresByTournament
);
router.get(
  "/tournament/:tid/category/:cid/level/:lid",
  authMiddleware(["Administrador", "Gimnasio", "Juez"]),
  getScoresByCategoryAndLevel
);
router.get(
  "/tournament/:tid/category/:cid/level/:lid/gym/:gid",
  authMiddleware(["Administrador", "Gimnasio", "Juez"]),
  getScoresByGym
);
router.post(
  "/:mid/tournament/:tid",
  authMiddleware(["Administrador", "Juez"]),
  postPuntaje
);

export default router;
