import { Router } from "express";
import {
  createTournament,
  deleteTournament,
  getAllTournaments,
  getMembersNotInTournaments,
  GetMembersTournamentByCategoryAndLevel,
  getMembersTournamentsByGym,
  getOneTournament,
  getTournamentsByDate,
  updatePayMemberTournament,
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
  "/:tid/category/:cid/level/:lid/gym/:gid",
  authMiddleware(["Administrador", "Gimnasio"]),
  getMembersTournamentsByGym
);
router.get(
  "/:tid/category/:cid/level/:lid",
  authMiddleware(["Administrador", "Gimnasio"]),
  GetMembersTournamentByCategoryAndLevel
);
router.get(
  "/not-in/:tid/category/:cid/level/:lid/gym/:gid",
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
router.patch(
  "/:tid/member/:mid",
  authMiddleware(["Administrador", "Gimnasio"]),
  updatePayMemberTournament
);
router.delete("/:id", authMiddleware(["Administrador"]), deleteTournament);

export default router;
