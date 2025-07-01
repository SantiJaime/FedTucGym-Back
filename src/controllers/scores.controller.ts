import type { Request, Response } from "express";
import { CreateScoreDTO } from "../schemas/scores.schema";
import { parseErrors } from "../utils/utils";
import ScoresService from "../services/scores.service";
import { IdDTO } from "../schemas/id.schema";

const scoreService = new ScoresService();

export const getAllScores = async (_req: Request, res: Response) => {
  try {
    const scores = await scoreService.getAll();
    res
      .status(200)
      .json({ message: "Tabla de puntajes obtenidos correctamente", scores });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const getScoresByTournament = async (req: Request, res: Response) => {
  try {
    const parsedTournamentId = IdDTO.safeParse(Number(req.params.tid));

    if (!parsedTournamentId.success) {
      const allMessages = parseErrors(parsedTournamentId.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }
    
    const scores = await scoreService.getByTournament(parsedTournamentId.data);
    res
      .status(200)
      .json({ message: "Tabla de puntajes obtenidos correctamente", scores });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const postPuntaje = async (req: Request, res: Response) => {
  try {
    const parsedScore = CreateScoreDTO.safeParse({
      id_member: Number(req.params.mid),
      id_tournament: Number(req.params.tid),
      puntaje: Number(req.body.puntaje),
    });
    if (!parsedScore.success) {
      const allMessages = parseErrors(parsedScore.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }
    const result = await scoreService.create(parsedScore.data);
    res
      .status(201)
      .json({ message: "Puntaje registrado correctamente", result });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};
