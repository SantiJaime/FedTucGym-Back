import type { Request, Response } from "express";
import TournamentService from "../services/tournaments.service";
import { CreateTournamentDTO } from "../schemas/tournaments.schema";
import { formatDateForDaterange, parseErrors, subtractDays } from "../utils/utils";
import { IdDTO } from "../schemas/id.schema";

const tournamentService = new TournamentService();

export const getAllTournaments = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const tournaments = await tournamentService.getAll();
    res
      .status(200)
      .json({ message: "Torneos obtenidos correctamente", tournaments });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const getTournamentsByDate = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tournaments = await tournamentService.getByDate();
    res
      .status(200)
      .json({ message: "Torneos obtenidos correctamente", tournaments });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
}

export const getOneTournament = async (
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

    const tournament = await tournamentService.getById(parsedId.data);
    if (!tournament) {
      res.status(404).json({ error: "Torneo no encontrado" });
      return;
    }
    res
      .status(200)
      .json({ message: "Torneo obtenido correctamente", tournament });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};
export const createTournament = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedTournament = CreateTournamentDTO.safeParse(req.body);

    if (!parsedTournament.success) {
      const allMessages = parseErrors(parsedTournament.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    const { name, startDate, endDate } = parsedTournament.data;

    const parsedDate = formatDateForDaterange({ startDate, endDate });
    const inscriptionDateEnd = subtractDays(startDate);

    const tournament = await tournamentService.create({ name, date_range: parsedDate, inscriptionDateEnd });
    res
      .status(201)
      .json({ message: "Torneo creado correctamente", tournament });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const updateTournament = async (
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

    const parsedTournament = CreateTournamentDTO.safeParse(req.body);
    if (!parsedTournament.success) {
      const allMessages = parseErrors(parsedTournament.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    const { name, startDate, endDate } = parsedTournament.data;

    const parsedDate = formatDateForDaterange({ startDate, endDate });
    const inscriptionDateEnd = subtractDays(startDate);
    const tournament = await tournamentService.update(parsedId.data, {
      name,
      date_range: parsedDate,
      inscriptionDateEnd
    });

    if (!tournament) {
      res.status(404).json({ error: "Torneo no encontrado" });
      return;
    }
    res
      .status(200)
      .json({ message: "Torneo actualizado correctamente", tournament });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const deleteTournament = async (
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
    const deletedTournament = await tournamentService.delete(parsedId.data);
    if (!deletedTournament) {
      res.status(404).json({ error: "Torneo no encontrado" });
      return;
    }

    res.status(200).json({ message: "Torneo eliminado correctamente" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};
