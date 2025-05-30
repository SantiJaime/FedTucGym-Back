import type { Request, Response } from "express";
import UserService from "../services/users.service";

const userService = new UserService();

export const getUsers = async (
  req: Request,
  res: Response
): Promise<void> => {};

export const getOneUser = async (
  req: Request,
  res: Response
): Promise<void> => {};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {};
