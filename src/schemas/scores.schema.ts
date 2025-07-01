import { z } from "zod";
import { IdDTO } from "./id.schema";

export const CreateScoreDTO = z.object({
  id_member: IdDTO,
  id_tournament: IdDTO,
  puntaje: z.number().nonnegative("El puntaje no puede ser negativo"),
});

export const ScoreDTO = CreateScoreDTO.extend({
  id: IdDTO,
});

export type Score = z.infer<typeof ScoreDTO>;
export type FullScoreInfo = {
  id: number;
  member: string;
  tournament: string;
  puntaje: number;
};
