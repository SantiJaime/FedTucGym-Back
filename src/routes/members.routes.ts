import { Router } from "express";
import {
  createMember,
  deleteMember,
  getAllMembers,
  getMembersByGym,
  getOneMember,
  registerMemberToTournament,
  updateMember,
} from "../controllers/members.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware(["Gimnasio", "Administrador"]), getAllMembers);
router.get("/:gid", authMiddleware(["Gimnasio", "Administrador"]), getMembersByGym);
router.get(
  "/:gid/:mid",
  authMiddleware(["Gimnasio", "Administrador"]),
  getOneMember
);
router.post("/", authMiddleware(["Gimnasio", "Administrador"]), createMember);
router.post(
  "/:mid/tournament/:tid",
  authMiddleware(["Gimnasio", "Administrador"]),
  registerMemberToTournament
);
router.patch(
  "/:id",
  authMiddleware(["Gimnasio", "Administrador"]),
  updateMember
);
router.delete(
  "/:id",
  authMiddleware(["Gimnasio", "Administrador"]),
  deleteMember
);

export default router;
