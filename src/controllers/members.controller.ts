import type { Request, Response } from "express";
import MembersService from "../services/members.service";
import { IdDTO } from "../schemas/id.schema";
import { parseErrors } from "../utils/utils";
import { CreateMemberDTO, UpdateMemberDTO } from "../schemas/members.shema";

const membersService = new MembersService();

export const getAllMembers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const members = await membersService.getAll();
    res
      .status(200)
      .json({ message: "Alumnos obtenidos correctamente", members });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const getMembersByGym = async (
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
    if (req.user?.role !== "Administrador" && parsedId.data !== req.user?.userId) {
      res
        .status(403)
        .json({
          error: "No tienes permiso para ver los miembros de este gimnasio",
        });
      return;
    }
    const members = await membersService.getByGymId(parsedId.data);
    res
      .status(200)
      .json({ message: "Alumnos obtenidos correctamente", members });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const getOneMember = async (
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

    const member = await membersService.getById(parsedId.data);
    if (!member) {
      res.status(404).json({ error: "Alumno no encontrado" });
      return;
    }
    res.status(200).json({ message: "Alumno obtenido correctamente", member });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const createMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedMember = CreateMemberDTO.safeParse(req.body);
    if (!parsedMember.success) {
      const allMessages = parseErrors(parsedMember.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    const member = await membersService.create(parsedMember.data);
    res.status(201).json({ message: "Alumno creado correctamente", member });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const updateMember = async (
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

    const parsedMember = UpdateMemberDTO.safeParse(req.body);
    if (!parsedMember.success) {
      const allMessages = parseErrors(parsedMember.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    const member = await membersService.update(
      parsedId.data,
      parsedMember.data
    );
    if (!member) {
      res.status(404).json({ error: "Alumno no encontrado" });
      return;
    }
    res
      .status(200)
      .json({ message: "Alumno actualizado correctamente", member });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const deleteMember = async (
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

    const deletedMember = await membersService.delete(parsedId.data);
    if (!deletedMember) {
      res.status(404).json({ error: "Alumno no encontrado" });
      return;
    }
    res.status(200).json({ message: "Alumno eliminado correctamente" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};

export const registerMemberToTournament = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const results: Record<string, number> = {};
    const params = { mid: req.params.mid, tid: req.params.tid };

    for (const [key, value] of Object.entries(params)) {
      const parsed = IdDTO.safeParse(Number(value));
      if (!parsed.success) {
        const allMessages = parseErrors(parsed.error.issues);
        res.status(400).json({ error: allMessages });
        return;
      }
      results[key] = parsed.data;
    }

    const memberId = results.mid;
    const tournamentId = results.tid;

    const member = await membersService.registerToTournament(
      memberId,
      tournamentId
    );
    if (!member) {
      res.status(404).json({ error: "Alumno y/o torneo no encontrado" });
      return;
    }
    res
      .status(200)
      .json({ message: "Alumno registrado correctamente", member });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Error desconocido" });
  }
};
