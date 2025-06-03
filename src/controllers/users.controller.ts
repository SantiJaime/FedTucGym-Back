import type { Request, Response } from "express";
import UserService from "../services/users.service";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserIdDTO,
} from "../schemas/user.schema";
import { hashPassword } from "../utils/bcrypt";
import { parseErrors } from "../utils/utils";

const userService = new UserService();

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
    const parsedId = UserIdDTO.safeParse(Number(req.params.id));

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
    const parsedId = UserIdDTO.safeParse(Number(req.params.id));

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
    const parsedId = UserIdDTO.safeParse(Number(req.params.id));

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
