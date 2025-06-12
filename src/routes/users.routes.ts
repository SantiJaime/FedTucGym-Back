import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { login, getUsers, getOneUser, createUser, updateUserFullname, deleteUser } from "../controllers/users.controller";


import { Request, Response } from "express";

const adminHandler = (req: Request, res: Response): void => { res.json({ msg: "Solo admin" }); };
const gymHandler = (req: Request, res: Response): void => { res.json({ msg: "Solo gymOwner" }); };
const juecesHandler = (req: Request, res: Response): void => { res.json({ msg: "Solo juez" }); }

const router = Router();

router.post("/login", login);
router.get("/", getUsers);
router.get("/:id", getOneUser);
router.post("/", authMiddleware("admin"), createUser);
router.patch("/:id", updateUserFullname);
router.delete("/:id", deleteUser);

//rutas protegidas: rol
router.get("/admin", authMiddleware("admin"), adminHandler);
router.get("/gym", authMiddleware("gymOwner"), gymHandler);
router.get("/jueces", authMiddleware("evaluator"), juecesHandler);

export default router;