import { Router } from "express";
import {
  createTournament,
  deleteTournament,
  getAllTournaments,
  getMembersNotInTournaments,
  getMembersTournamentByCategoryAndLevel,
  getMembersTournamentsByGym,
  getOneTournament,
  getPastTournamentsByDate,
  getTournamentsByDate,
  postDataOnSheets,
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
  authMiddleware(["Administrador", "Gimnasio", "Juez"]),
  getTournamentsByDate
);
router.get(
  "/date/past",
  authMiddleware(["Administrador", "Gimnasio", "Juez"]),
  getPastTournamentsByDate
);
router.get(
  "/:tid/category/:cid/level/:lid/gym/:gid",
  authMiddleware(["Administrador", "Gimnasio"]),
  getMembersTournamentsByGym
);
router.get(
  "/:tid/category/:cid/level/:lid",
  authMiddleware(["Administrador", "Gimnasio", "Juez"]),
  getMembersTournamentByCategoryAndLevel
);
router.post("/:tid/sheets", postDataOnSheets);
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
