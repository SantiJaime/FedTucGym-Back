import type { Request, Response } from "express";
import UserService from "../services/users.service";
import {
  CreateUserDTO,
  LoginUserDTO,
  UpdateUserDTO,
} from "../schemas/users.schema";
import { hashPassword, hashToken } from "../utils/bcrypt";
import { parseErrors } from "../utils/utils";
import { comparePassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt.config";
import { IdDTO } from "../schemas/id.schema";
import { env } from "../config/env";

const userService = new UserService();

const NODE_ENV_PRODUCTION = env.NODE_ENV === "production";

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.signedCookies;

  if (!refreshToken) {
    res.status(401).json({ error: "Acceso denegado" });
    return;
  }

  const payload = req.user; 

  if(!payload){
    res.status(401).json({ error: "Acceso denegado, no se encontró el usuario" });
    return;
  }

  const hashedToken = hashToken(refreshToken);
  const isRefreshTokenValid = await userService.validateToken(
    hashedToken,
    payload.userId
  );

  if (!isRefreshTokenValid) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: NODE_ENV_PRODUCTION,
      sameSite: NODE_ENV_PRODUCTION ? "none" : "lax",
      signed: true,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: NODE_ENV_PRODUCTION,
      sameSite: NODE_ENV_PRODUCTION ? "none" : "lax",
      signed: true,
    });
    res.status(401).json({
      error: "Sesión expirada. Por favor, vuelva a iniciar sesión",
      redirect: true,
    });
    return;
  }

  const token = generateToken(
    {
      userId: payload.userId,
      role: payload.role,
      full_name: payload.full_name,
    },
    env.JWT_SECRET as string,
    60 * 60
  );

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: NODE_ENV_PRODUCTION,
    sameSite: NODE_ENV_PRODUCTION ? "none" : "lax",
    maxAge: 1 * 60 * 60 * 1000,
    signed: true,
  });

  res.status(200).json({ message: "Sesión extendida correctamente" });
};

export const login = async (req: Request, res: Response) => {
  const parsedUser = LoginUserDTO.safeParse(req.body);

  if (!parsedUser.success) {
    const allMessages = parseErrors(parsedUser.error.issues);
    res.status(400).json({ error: allMessages });
    return;
  }

  const { full_name, password } = parsedUser.data;

  const user = await userService.getByName(full_name);
  if (!user) {
    res
      .status(401)
      .json({ error: "Nombre de usuario y/o contraseña incorrectos" });
    return;
  }

  const validPassword = await comparePassword(
    password,
    user.password as string
  );
  if (!validPassword) {
    res
      .status(401)
      .json({ error: "Nombre de usuario y/o contraseña incorrectos" });
    return;
  }

  const payload = { userId: user.id, role: user.role, full_name };
  const accessToken = generateToken(payload, env.JWT_SECRET as string, 30 * 60);
  const refreshToken = generateToken(
    payload,
    env.JWT_REFRESH_SECRET as string,
    60 * 60 * 24
  );

  const hashedToken = hashToken(refreshToken);

  await userService.saveToken(hashedToken, user.id);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: NODE_ENV_PRODUCTION,
    sameSite: NODE_ENV_PRODUCTION ? "none" : "lax",
    maxAge: 30 * 60 * 1000,
    signed: true,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: NODE_ENV_PRODUCTION,
    sameSite: NODE_ENV_PRODUCTION ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    signed: true,
  });
  res
    .status(200)
    .json({
      message: "Sesión iniciada correctamente",
      userInfo: { userId: user.id, logged: true, role: user.role, full_name },
    });
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAll();
    res
      .status(200)
      .json({ message: "Usuarios obtenidos correctamente", users });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const getOneUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedId = IdDTO.safeParse(Number(req.params.id));

    if (!parsedId.success) {
      const allMessages = parseErrors(parsedId.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    const user = await userService.getById(parsedId.data);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json({ message: "Usuario obtenido correctamente", user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedUser = CreateUserDTO.safeParse(req.body);

    if (!parsedUser.success) {
      const allMessages = parseErrors(parsedUser.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    parsedUser.data.password = await hashPassword(parsedUser.data.password);

    const user = await userService.create(parsedUser.data);
    res.status(201).json({ message: "Usuario creado correctamente", user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const updateUserFullname = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedId = IdDTO.safeParse(Number(req.params.id));

    if (!parsedId.success) {
      const allMessages = parseErrors(parsedId.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    const parsedUser = UpdateUserDTO.safeParse(req.body);

    if (!parsedUser.success) {
      const allMessages = parseErrors(parsedUser.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    const user = await userService.updateFullname(
      parsedId.data,
      parsedUser.data
    );
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res
      .status(200)
      .json({ message: "Nombre del usuario actualizado correctamente", user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedId = IdDTO.safeParse(Number(req.params.id));

    if (!parsedId.success) {
      const allMessages = parseErrors(parsedId.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    const deletedUser = await userService.delete(parsedId.data);
    if (!deletedUser) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: NODE_ENV_PRODUCTION,
    sameSite: NODE_ENV_PRODUCTION ? "none" : "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: NODE_ENV_PRODUCTION,
    sameSite: NODE_ENV_PRODUCTION ? "none" : "lax",
  });

  res.status(200).json({ message: "Sesión cerrada correctamente" });
};
