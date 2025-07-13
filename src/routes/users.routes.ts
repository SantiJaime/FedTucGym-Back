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
  logout,
  getUsersByRole,
} from "../controllers/users.controller";
import { refreshAuthMiddleware } from '../middleware/refreshAuth';

const router = Router();

router.get("/", authMiddleware(["Administrador"]), getUsers);
router.get("/:id", authMiddleware(["Administrador", "Administrador", "Juez"]), getOneUser);
router.get("/role/:rid", authMiddleware(["Administrador"]), getUsersByRole);
router.post("/", authMiddleware(["Administrador"]), createUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshAuthMiddleware(["Administrador", "Gimnasio", "Juez"]), refreshAccessToken)
router.patch(
  "/:id",
  authMiddleware(["Administrador", "Gimnasio", "Juez"]),
  updateUserFullname
);
router.delete("/:id", authMiddleware(["Administrador"]), deleteUser);

export default router;
