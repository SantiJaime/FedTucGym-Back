import { z } from "zod";
import { IdDTO } from "./id.schema";
import { BirthDateDTO } from './date.schema';

export const CreateMemberDTO = z.object({
  full_name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "El nombre debe como máximo 255 caracteres"),
  birth_date: BirthDateDTO,
  age: z.number().int("La edad debe ser un número entero").nonnegative("La edad no puede ser negativa"),
  category: z.string(),
  id_gym: IdDTO,
});

export const MemberDTO = CreateMemberDTO.extend({
  id: IdDTO,
});

export const UpdateMemberDTO = MemberDTO.pick({
  full_name: true,
  birth_date: true,
  age: true,
  category: true,
  id_gym: true,
});

export type Member = z.infer<typeof MemberDTO>;
