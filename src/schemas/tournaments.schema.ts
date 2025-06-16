import { z } from "zod";
import { DateDTO } from "./date.schema";
import { IdDTO } from './id.schema';

export const CreateTournamentDTO = z.object({
  name: z
    .string()
    .min(3, "El nombre del torneo debe tener al menos 3 caracteres"),
  startDate: DateDTO,
  endDate: DateDTO,
});

const TournamentDTO = z.object({
  id: IdDTO,
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  date_range: z.string(),
  inscriptionDateEnd: z.string(),
});

export type Tournament = z.infer<typeof TournamentDTO>;
