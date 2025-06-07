import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header("authorization");
      if (!authHeader) {
         res.status(401).json({ msg: "No estás autorizado" });
         return
      }

      const token = authHeader.split(" ")[1]; 
      if (!token) {
         res.status(401).json({ msg: "Token no proporcionado" });
         return
      }

      const verificarToken = jwt.verify(token, process.env.JWT_SECRET || "secreto") as any;

      if (verificarToken.role === role) {
        (req as any).userId = verificarToken.userId;
         next(); 
         return
      } else {
         res.status(403).json({ msg: "No tienes el permiso suficiente" });
         return
      }
    } catch (error) {
       res.status(401).json({ msg: "Token inválido" });
       return
    }
  };
};