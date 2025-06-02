import type { Request, Response } from "express";
import UserService from "../services/users.service";
import { CreateUserDTO, UpdateUserDTO, UserIdDTO } from "../schemas/user.schema";
import { hashPassword } from '../utils/bcrypt';

const userService = new UserService();

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
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
    console.log(req.params.id);
    const parsedId = UserIdDTO.safeParse(Number(req.params.id));

    if (!parsedId.success) {
      const allMessages = parsedId.error.issues
        .map((issue) => `${issue.path} ${issue.message}`)
        .join(", ");
      res.status(400).json({ error: allMessages });
      return;
    }

    const user = await userService.getUserById(parsedId.data);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(user);
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
      console.log(parsedUser.error);
      const allMessages = parsedUser.error.issues
        .map((issue) => `${issue.path} ${issue.message}`)
        .join(", ");
      res.status(400).json({ error: allMessages });
      return;
    }

    parsedUser.data.password = await hashPassword(parsedUser.data.password);

    const user = await userService.createUser(parsedUser.data);
    res.status(201).json(user);
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
      const allMessages = parsedId.error.issues
        .map((issue) => `${issue.path} ${issue.message}`)
        .join(", ");
      res.status(400).json({ error: allMessages });
      return;
    }

    const parsedUser = UpdateUserDTO.safeParse(req.body);

    if (!parsedUser.success) {
      const allMessages = parsedUser.error.issues
        .map((issue) => `${issue.path} ${issue.message}`)
        .join(", ");
      res.status(400).json({ error: allMessages });
      return;
    }

    const user = await userService.updateUserFullname(parsedId.data, parsedUser.data);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(user);

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
      const allMessages = parsedId.error.issues
        .map((issue) => `${issue.path} ${issue.message}`)
        .join(", ");
      res.status(400).json({ error: allMessages });
      return;
    }

    const deletedUser = await userService.deleteUser(parsedId.data);
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
