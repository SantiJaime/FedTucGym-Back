import { z } from "zod";
import { IdDTO } from "./id.schema";
import { BirthDateDTO } from "./date.schema";
import { PageDTO } from "./page.schema";

export const CreateMemberDTO = z.object({
  full_name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "El nombre debe como máximo 255 caracteres"),
  birth_date: BirthDateDTO,
  id_gym: IdDTO,
  dni: z
    .number()
    .int("El DNI debe ser un número entero")
    .nonnegative("El DNI no puede ser negativo")
    .min(7, "El DNI debe tener al menos 7 caracteres"),
  id_level: IdDTO,
});

export const MemberDTO = CreateMemberDTO.extend({
  id: IdDTO,
});

export const FilterMembersDTO = z.object({
  full_name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "El nombre debe como máximo 255 caracteres")
    .optional(),
  id_category: IdDTO.optional(),
  id_level: IdDTO.optional(),
  dni: z
    .number()
    .int("El DNI debe ser un número entero")
    .nonnegative("El DNI no puede ser negativo")
    .min(7, "El DNI debe tener al menos 7 caracteres")
    .max(8, "El DNI debe tener como máximo 8 caracteres")
    .optional(),
  page: PageDTO,
});

export type Member = z.infer<typeof MemberDTO>;
export type MembersFilter = z.infer<typeof FilterMembersDTO>;
