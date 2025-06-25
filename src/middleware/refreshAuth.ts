import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.config";
import { env } from '../config/env';

const ROLES = ["Administrador", "Juez", "Gimnasio"] as const;
type UserRole = (typeof ROLES)[number];

export const refreshAuthMiddleware = (requiredRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const signedRefreshToken = req.signedCookies.refreshToken;
    if (!signedRefreshToken) {
      res
        .status(401)
        .json({ error: "No estás autorizado, no has iniciado sesión" });
      return;
    }

    try {
      const payloadUser = verifyToken(
        signedRefreshToken,
        env.JWT_REFRESH_SECRET as string
      );

      const isValidRole = (role: string): role is UserRole => {
        return ROLES.includes(role as UserRole);
      };

      if (
        !isValidRole(payloadUser.role) ||
        !requiredRoles.includes(payloadUser.role as UserRole)
      ) {
        res.status(403).json({ error: "Acceso denegado" });
        return;
      }

      req.user = payloadUser;
      next();
    } catch (error) {
      if (error instanceof Error) {
        res.status(403).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Error desconocido al verificar el rol" });
    }
  };
};
