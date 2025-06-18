import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  login,
  getUsers,
  getOneUser,
  createUser,
  updateUserFullname,
  deleteUser,
  refreshAccessToken,
} from "../controllers/users.controller";

const router = Router();

router.get("/", authMiddleware(["Administrador"]), getUsers);
router.get("/:id", authMiddleware(["Administrador"]), getOneUser);
router.post("/", authMiddleware(["Administrador"]), createUser);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken)
router.patch(
  "/:id",
  authMiddleware(["Administrador", "Gimnasio", "Juez"]),
  updateUserFullname
);
router.delete("/:id", authMiddleware(["Administrador"]), deleteUser);

export default router;
