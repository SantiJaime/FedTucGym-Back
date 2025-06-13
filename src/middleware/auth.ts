import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.config";

enum UserRole {
  ADMIN = 1,
  EVALUATOR = 2,
  GYM_OWNER = 3,
}

const ROLE_MAP = {
  admin: UserRole.ADMIN,
  evaluator: UserRole.EVALUATOR,
  gymOwner: UserRole.GYM_OWNER,
} as const;

export const authMiddleware = (
  requiredRole: keyof typeof ROLE_MAP | (keyof typeof ROLE_MAP)[]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const signedAccessToken = req.signedCookies.accessToken;
    if (!signedAccessToken) {
      res.status(401).json({ error: "No estás autorizado" });
      return;
    }
    try {
      const payloadUser = verifyToken(signedAccessToken);

      const allowedRoles = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];

      const allowedRoleIds = allowedRoles.map((role) => ROLE_MAP[role]);

      if (!allowedRoleIds.includes(payloadUser.roleId)) {
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
