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
router.get("/", authMiddleware(["Administrador"]), getUsers);
router.get("/:id", authMiddleware(["Administrador"]), getOneUser);
router.post("/", authMiddleware(["Administrador"]), createUser);
router.patch(
  "/:id",
  authMiddleware(["Administrador", "Gimnasio", "Juez"]),
  updateUserFullname
);
router.delete("/:id", authMiddleware(["Administrador"]), deleteUser);

export default router;
