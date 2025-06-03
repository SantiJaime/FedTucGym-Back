import { Router } from "express";
import {
  createTournament,
  deleteTournament,
  getAllTournaments,
  getOneTournament,
  updateTournament,
} from "../controllers/tournaments.controller";

const router = Router();

router.get("/", getAllTournaments);
router.get("/:id", getOneTournament);
router.post("/", createTournament);
router.put("/:id", updateTournament);
router.delete("/:id", deleteTournament);

export default router;
