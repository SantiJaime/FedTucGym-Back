import type { Request, Response } from "express";
import MembersService from "../services/members.service";
import { IdDTO } from "../schemas/id.schema";
import { parseErrors } from "../utils/utils";
import { CreateMemberDTO, UpdateMemberDTO } from "../schemas/members.shema";
import { calculateAgeAndCategory } from "../utils/categories";

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
    if (
      req.user?.role !== "Administrador" &&
      parsedId.data !== req.user?.userId
    ) {
      res.status(403).json({
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

    const { age, category } = calculateAgeAndCategory(
      parsedMember.data.birth_date
    );

    if (age < 6) {
      res
        .status(400)
        .json({
          error:
            "El alumno debe tener al menos 6 años para poder ser registrado",
        });
      return;
    }

    const member = await membersService.create({
      ...parsedMember.data,
      age,
      category,
    });
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

    const { age, category } = calculateAgeAndCategory(
      parsedMember.data.birth_date
    );

    if (age < 6) {
      res
        .status(400)
        .json({ error: "La edad del alumno debe ser al menos 6 años" });
      return;
    }

    const member = await membersService.update(parsedId.data, {
      ...parsedMember.data,
      age,
      category,
    });
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
    const parsedMemberId = IdDTO.safeParse(Number(req.params.mid));
    if (!parsedMemberId.success) {
      const allMessages = parseErrors(parsedMemberId.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }
    const parsedTournamentId = IdDTO.safeParse(Number(req.params.tid));
    if (!parsedTournamentId.success) {
      const allMessages = parseErrors(parsedTournamentId.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    const member = await membersService.registerToTournament(
      parsedMemberId.data,
      parsedTournamentId.data
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
