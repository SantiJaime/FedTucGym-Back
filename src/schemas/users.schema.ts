import { z } from "zod";
import { IdDTO } from "./id.schema";

export const CreateUserDTO = z.object({
  full_name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "El nombre debe como máximo 255 caracteres"),
  email: z
    .string()
    .email("Formato de correo electrónico inválido")
    .max(100, "El correo electrónica debe como máximo 100 caracteres"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  id_role: IdDTO,
});

export const UserDTO = CreateUserDTO.extend({
  id: IdDTO,
});

export const UpdateUserDTO = UserDTO.pick({
  full_name: true,
});

export type User = z.infer<typeof UserDTO>;
