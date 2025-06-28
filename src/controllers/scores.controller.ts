import { Request, Response } from "express";
import { registrarPuntaje } from "../services/scores.service";

export const postPuntaje = async (req: Request, res: Response) => {
  const { id_member, id_tournament, puntaje } = req.body;
  try {
    await registrarPuntaje(id_member, id_tournament, puntaje);
    res.status(201).json({ message: "Puntaje registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar puntaje" });
  }
};