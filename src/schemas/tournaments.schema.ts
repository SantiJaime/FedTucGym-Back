import { z } from "zod";
import { DateDTO } from "./date.schema";

export const CreateTournamentDTO = z.object({
  name: z
    .string()
    .min(3, "El nombre del torneo debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres"),
  startDate: DateDTO,
  endDate: DateDTO,
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

export type Tournament = z.infer<typeof TournamentDTO>;
