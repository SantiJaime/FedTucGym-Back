import { z } from "zod";
import { idSchema } from './user.schema';

const validateDateFormat = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const validateDateNotPast = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

export const CreateTournamentDTO = z.object({
  name: z.string().min(3, "El nombre del torneo debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres"),
  startDate: z
    .string()
    .refine(validateDateFormat, {
      message: "La fecha debe tener el formato YYYY-MM-DD",
    })
    .refine(validateDateNotPast, {
      message: "La fecha no puede ser pasada",
    }),
  endDate: z
    .string()
    .refine(validateDateFormat, {
      message: "La fecha debe tener el formato YYYY-MM-DD",
    })
    .refine(validateDateNotPast, {
      message: "La fecha no puede ser pasada",
    }),
});

export const TournamentDTO = z.object({
  id_tournament: z
    .number()
    .int("El id debe ser un número entero")
    .nonnegative("El id no puede ser negativo"),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres"),
  date_range: z.string(),
});

export const TournamentIdDTO = idSchema;

export type Tournament = z.infer<typeof TournamentDTO>;
