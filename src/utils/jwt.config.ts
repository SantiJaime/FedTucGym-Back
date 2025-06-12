import jwt, { type JwtPayload } from "jsonwebtoken";

interface Payload {
  userId: number;
  email: string;
  roleId: number;
}
type CustomJwtPayload = JwtPayload & Payload;

const JWT_SECRET = process.env.JWT_SECRET || "secreto_jwt";

export const generateToken = (payload: Payload): string => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  return token;
};

export const verifyToken = (token: string): CustomJwtPayload => {
  try {
    const verify = jwt.verify(token, JWT_SECRET);

    if (typeof verify === "string") {
      throw new Error("Token payload inválido");
    }

    return verify as CustomJwtPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw error;
    }
    throw new Error("Error desconocido de JWT");
  }
};
