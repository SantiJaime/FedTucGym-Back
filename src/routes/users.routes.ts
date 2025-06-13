import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  login,
  getUsers,
  getOneUser,
  createUser,
  updateUserFullname,
  deleteUser,
} from "../controllers/users.controller";

const router = Router();

router.post("/login", login);
router.get("/", authMiddleware("admin"), getUsers);
router.get("/:id", authMiddleware("admin"), getOneUser);
router.post("/", createUser);
router.patch(
  "/:id",
  authMiddleware(["admin", "gymOwner", "evaluator"]),
  updateUserFullname
);
router.delete("/:id", authMiddleware("admin"), deleteUser);

export default router;
