import { Router } from "express";
import {
  createTournament,
  deleteTournament,
  getAllTournaments,
  getMembersNotInTournaments,
  getMembersTournaments,
  getOneTournament,
  getTournamentsByDate,
  updateTournament,
} from "../controllers/tournaments.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  authMiddleware(["Administrador", "Gimnasio"]),
  getAllTournaments
);
router.get(
  "/date",
  authMiddleware(["Administrador", "Gimnasio"]),
  getTournamentsByDate
);
router.get(
  "/:tid/gym/:gid",
  authMiddleware(["Administrador", "Gimnasio"]),
  getMembersTournaments
);
router.get(
  "/not-in/:tid/gym/:gid",
  authMiddleware(["Administrador", "Gimnasio"]),
  getMembersNotInTournaments
);

router.get(
  "/:id",
  authMiddleware(["Administrador", "Gimnasio"]),
  getOneTournament
);
router.post("/", authMiddleware(["Administrador"]), createTournament);
router.put("/:id", authMiddleware(["Administrador"]), updateTournament);
router.delete("/:id", authMiddleware(["Administrador"]), deleteTournament);

export default router;
