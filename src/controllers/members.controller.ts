import type { Request, Response } from "express";
import MembersService from "../services/members.service";
import { IdDTO } from "../schemas/id.schema";
import {
  buildCountMembersQuery,
  buildMembersQuery,
  parseErrors,
  toNumberOrUndefined,
} from "../utils/utils";
import { CreateMemberDTO, FilterMembersDTO } from "../schemas/members.shema";
import { calcularEdadYCategoriaAl31Dic } from "../utils/categories";
import { RegisterMembersTournamentsDTO } from "../schemas/members_tournaments.schema";

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
    const parsedId = IdDTO.safeParse(Number(req.params.gid));
    if (!parsedId.success) {
      const allMessages = parseErrors(parsedId.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }
    const parsedFilters = FilterMembersDTO.safeParse({
      ...req.query,
      id_category: toNumberOrUndefined(req.query.id_category),
      id_level: toNumberOrUndefined(req.query.id_level),
      dni: toNumberOrUndefined(req.query.dni),
      page: Number(req.query.page),
    });
    if (!parsedFilters.success) {
      const allMessages = parseErrors(parsedFilters.error.issues);
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

    const { query, values } = buildMembersQuery(
      parsedFilters.data,
      parsedId.data,
      parsedFilters.data.page
    );
    const { countQuery, values: countValues } = buildCountMembersQuery(
      parsedFilters.data,
      parsedId.data
    );
    const { data: members, total } = await membersService.getByGymId(
      query,
      values,
      countQuery,
      countValues
    );
    if (members.length === 0) {
      res
        .status(404)
        .json({
          error:
            "No se encontraron alumnos alumnos con los parámetros ingresados",
        });
      return;
    }
    res.status(200).json({
      message: "Alumnos obtenidos correctamente",
      members,
      pagination: {
        total,
        page: parsedFilters.data.page || 1,
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

    const { age, id_category } = calcularEdadYCategoriaAl31Dic(
      parsedMember.data.birth_date
    );

    if (age < 6 || id_category === null) {
      res.status(400).json({
        error: "El alumno debe tener al menos 6 años para poder ser registrado",
      });
      return;
    }

    const member = await membersService.create({
      ...parsedMember.data,
      age,
      id_category,
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

    const parsedMember = CreateMemberDTO.safeParse(req.body);
    if (!parsedMember.success) {
      const allMessages = parseErrors(parsedMember.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    const { age, id_category } = calcularEdadYCategoriaAl31Dic(
      parsedMember.data.birth_date
    );

    if (age < 6 || id_category === null) {
      res
        .status(400)
        .json({ error: "La edad del alumno debe ser al menos 6 años" });
      return;
    }

    const member = await membersService.update(parsedId.data, {
      ...parsedMember.data,
      age,
      id_category,
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
    const parsedIds = RegisterMembersTournamentsDTO.safeParse({
      id_member: Number(req.params.mid),
      id_tournament: Number(req.params.tid),
    });
    if (!parsedIds.success) {
      const allMessages = parseErrors(parsedIds.error.issues);
      res.status(400).json({ error: allMessages });
      return;
    }

    const member = await membersService.registerToTournament(
      parsedIds.data.id_member,
      parsedIds.data.id_tournament
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
