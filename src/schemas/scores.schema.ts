import { z } from "zod";
import { IdDTO } from "./id.schema";
import { PageDTO } from "./page.schema";

export const CreateScoreDTO = z.object({
  id_member: IdDTO,
  id_tournament: IdDTO,
  puntaje: z.number().nonnegative("El puntaje no puede ser negativo"),
});

export const ScoreDTO = CreateScoreDTO.extend({
  id: IdDTO,
});

export const GetScoresDTO = z.object({
  id_category: IdDTO,
  id_level: IdDTO,
  id_tournament: IdDTO,
  page: PageDTO,
});

export const GetScoresByGymDTO = GetScoresDTO.extend({
  id_gym: IdDTO,
});

export type GetScores = z.infer<typeof GetScoresDTO>;
export type GetScoresByGym = z.infer<typeof GetScoresByGymDTO>;

export type Score = z.infer<typeof ScoreDTO>;
export type FullScoreInfo = {
  id: number;
  member_name: string;
  member_dni: number;
  id_tournament: number;
  id_category: number;
  id_gym: number;
  gym: string;
  puntaje: number;
  total_count: number;
};
