import { z } from "zod";
import { IdDTO } from "./id.schema";
import { BirthDateDTO } from "./date.schema";

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
  id_level: z
    .number()
    .int("El ID de nivel debe ser un número entero")
    .nonnegative("El ID de nivel no puede ser negativo"),
});

export const MemberDTO = CreateMemberDTO.extend({
  id: IdDTO,
});

export const UpdateMemberDTO = MemberDTO.pick({
  full_name: true,
  birth_date: true,
  id_gym: true,
});

export type Member = z.infer<typeof MemberDTO>;
