import { z } from "zod";
import { IdDTO } from "./id.schema";

export const CreateMemberDTO = z.object({
  full_name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "El nombre debe como máximo 255 caracteres"),
  email: z
    .string()
    .email("Formato de correo electrónico inválido")
    .max(100, "El correo electrónica debe como máximo 100 caracteres"),
  membership_number: z
    .number()
    .int("El número de asociado debe ser un número entero")
    .nonnegative("El número de asociado no puede ser negativo"),
  id_gym: IdDTO,
});

export const MemberDTO = CreateMemberDTO.extend({
  id: IdDTO,
});

export const UpdateMemberDTO = MemberDTO.pick({
  full_name: true,
  email: true,
});

export type Member = z.infer<typeof MemberDTO>;
