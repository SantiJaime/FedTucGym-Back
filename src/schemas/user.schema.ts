import { z } from "zod";

export const CreateUserDTO = z.object({
  full_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Formato de correo electrónico inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  membership_number: z.number().int("El número de asociado debe ser un número entero").nonnegative("El número de asociado no puede ser negativo"),
  id_role: z.number().int("El id del rol debe ser un número entero").nonnegative("El id del rol no puede ser negativo"),
});

const idSchema = z
  .number({
    invalid_type_error: "El id debe ser un número",
    required_error: "El id es obligatorio",
  })
  .int("El id debe ser un número entero")
  .nonnegative("El id no puede ser negativo");

export const UserDTO = CreateUserDTO.extend({
  id: idSchema,
});

export const UpdateUserDTO = UserDTO.pick({
  full_name: true,
});

export const UserIdDTO = idSchema

export type User = z.infer<typeof UserDTO>;
