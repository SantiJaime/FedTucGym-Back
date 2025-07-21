import type { Request, Response } from "express";
import TournamentService from "../services/tournaments.service";
import { CreateTournamentDTO } from "../schemas/tournaments.schema";
import {
  formatDateForDaterange,
  parseErrors,
  subtractDays,
} from "../utils/utils";
import { IdDTO } from "../schemas/id.schema";
import {
  GetMembersTournamentsByGymDTO,
  GetMembersTournamentsDTO,
  UpdatePaidMembersTournamentsDTO,
} from "../schemas/members_tournaments.schema";
import { DatabaseError } from "pg";
import { env } from "../config/env";

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

export const getTournamentsByDate = async (
  _req: Request,
  res: Response
): Promise<void> => {
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
};

export const getPastTournamentsByDate = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const tournaments = await tournamentService.getPastByDate();
    res
      .status(200)
      .json({ message: "Torneos obtenidos correctamente", tournaments });
  } catch (error) {
    if (error instanceof Error || error instanceof DatabaseError) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

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

    const tournament = await tournamentService.create({
      name,
      date_range: parsedDate,
      inscriptionDateEnd,
    });
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
      inscriptionDateEnd,
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

export const getMembersTournamentsByGym = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedData = GetMembersTournamentsByGymDTO.safeParse({
      id_gym: Number(req.params.gid),
      id_tournament: Number(req.params.tid),
      id_level: Number(req.params.lid),
      id_category: Number(req.params.cid),
      page: Number(req.query.page),
    });
    if (!parsedData.success) {
      const allMessages = parseErrors(parsedData.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }
    if (
      parsedData.data.id_gym !== req.user?.userId &&
      req.user?.role !== "Administrador"
    ) {
      res.status(403).json({
        error:
          "No tienes permiso para ver los alumnos registrados a este torneo",
      });
      return;
    }
    const offset = (parsedData.data.page - 1) * 20;
    const membersTournaments =
      await tournamentService.getMembersTournamentByGym(
        parsedData.data,
        offset
      );
    const total =
      membersTournaments.length > 0 ? membersTournaments[0].total_count : 0;
    res.status(200).json({
      message: "Alumnos registrados al torneo obtenidos correctamente",
      membersTournaments,
      pagination: {
        total,
        page: parsedData.data.page,
        perPage: 20,
        totalPages: Math.ceil(total / 20),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const getMembersNotInTournaments = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedData = GetMembersTournamentsByGymDTO.safeParse({
      id_gym: Number(req.params.gid),
      id_tournament: Number(req.params.tid),
      id_level: Number(req.params.lid),
      id_category: Number(req.params.cid),
      page: Number(req.query.page),
    });
    if (!parsedData.success) {
      const allMessages = parseErrors(parsedData.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }
    if (
      parsedData.data.id_gym !== req.user?.userId &&
      req.user?.role !== "Administrador"
    ) {
      res.status(403).json({
        error:
          "No tienes permiso para ver los alumnos registrados a este torneo",
      });
      return;
    }
    const offset = (parsedData.data.page - 1) * 20;
    const members = await tournamentService.getMembersNotInTournament(
      parsedData.data,
      offset
    );

    if (members.length === 0) {
      res.status(404).json({
        error:
          "No se encontraron alumnos NO registrados a este torneo con los parámetros ingresados",
      });
      return;
    }

    const total = members[0].total_count;
    res.status(200).json({
      message: "Alumnos NO registrados al torneo obtenidos correctamente",
      members,
      pagination: {
        total,
        page: parsedData.data.page,
        perPage: 20,
        totalPages: Math.ceil(total / 20),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const postDataOnSheets = async (req: Request, res: Response) => {
  try {
    const parsedId = IdDTO.safeParse(Number(req.params.tid));
    if (!parsedId.success) {
      const allMessages = parseErrors(parsedId.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }
    const { membersTournaments, tournamentName } =
      await tournamentService.getAllMembersByTournament(parsedId.data);

    const scriptUrl = env.SHEETS_SCRIPT_URL;
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ membersTournaments, tournamentName }),
    });
    if (!response.ok) {
      const text = await response.text();
      res.status(500).json({ error: text });
      return;
    }
    const data = await response.json();
    res
      .status(200)
      .json({ message: "Datos enviados correctamente", url: data.url });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los alumnos" });
    console.log(error);
  }
};

export const getMembersTournamentByCategoryAndLevel = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedData = GetMembersTournamentsDTO.safeParse({
      id_category: Number(req.params.cid),
      id_level: Number(req.params.lid),
      id_tournament: Number(req.params.tid),
      page: 1,
    });
    if (!parsedData.success) {
      const allMessages = parseErrors(parsedData.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }
    const offset = (parsedData.data.page - 1) * 20;
    const membersTournaments =
      await tournamentService.getMembersTournamentByCategoryAndLevel(
        parsedData.data,
        offset
      );

    if (membersTournaments.length === 0) {
      res.status(404).json({
        error:
          "No se encontraron alumnos registrados a este torneo con los parámetros ingresados",
      });
      return;
    }
    const total = membersTournaments[0].total_count;
    res.status(200).json({
      message: "Alumnos registrados al torneo obtenidos correctamente",
      membersTournaments,
      pagination: {
        total: total,
        page: parsedData.data.page,
        perPage: 20,
        totalPages: Math.ceil(total / 20),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const updatePayMemberTournament = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedData = UpdatePaidMembersTournamentsDTO.safeParse({
      id_member: Number(req.params.mid),
      id_tournament: Number(req.params.tid),
      paid: req.body.paid,
    });
    if (!parsedData.success) {
      const allMessages = parseErrors(parsedData.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    const updatedMemberTournament = await tournamentService.updatePayTournament(
      parsedData.data
    );
    if (!updatedMemberTournament) {
      res.status(404).json({ error: "Torneo y/o alumno no encontrado(s)" });
      return;
    }

    res.status(200).json({
      message: "Alumno actualizado correctamente",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};
