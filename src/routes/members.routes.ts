import { Router } from "express";
import {
  createMember,
  deleteMember,
  getAllMembers,
  getOneMember,
  registerMemberToTournament,
  updateMember,
} from "../controllers/members.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware(["gymOwner", "admin"]), getAllMembers);
router.get("/:gid/:mid", authMiddleware("gymOwner"), getOneMember);
router.post("/", authMiddleware("gymOwner"), createMember);
router.post(
  "/:mid/tournament/:tid",
  authMiddleware("gymOwner"),
  registerMemberToTournament
);
router.patch("/:id", authMiddleware("gymOwner"), updateMember);
router.delete("/:id", authMiddleware("gymOwner"), deleteMember);

export default router;
