import { DatabaseError } from "pg";
import pool from "../database/db.config";
import {
  FullScoreInfo,
  GetScores,
  GetScoresByGym,
  Score,
} from "../schemas/scores.schema";

export default class ScoresService {
  public async create(data: Omit<Score, "id">): Promise<Score> {
    try {
      const { id_member, id_tournament, puntaje } = data;
      const { rows } = await pool.query(
        "INSERT INTO puntajes (id_member, id_tournament, puntaje) VALUES ($1, $2, $3) RETURNING *",
        [id_member, id_tournament, puntaje]
      );
      await pool.query(
        "UPDATE members_tournaments SET scored = true WHERE id_member = $1 AND id_tournament = $2",
        [id_member, id_tournament]
      );
      return rows[0];
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === "23505") {
          throw new Error("El alumno ya esta registrado en el torneo");
        } else if (error.code === "23503") {
          throw new Error("No se encontró al alumno con la ID proporcionada");
        } else if (error.code === "23502") {
          throw new Error("No se encontró el torneo con la ID proporcionada");
        }
      }
      throw new Error("Error de base de datos desconocido");
    }
  }

  public async getAll(): Promise<FullScoreInfo[]> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM scores_view ORDER BY puntaje DESC"
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getByCategoryLevelAndGym(
    DataIds: GetScoresByGym
  ): Promise<FullScoreInfo[]> {
    try {
      const { id_category, id_level, id_gym, id_tournament } = DataIds;
      const { rows } = await pool.query(
        "SELECT * FROM get_scores_by_category_level_and_gym($1, $2, $3, $4)",
        [id_category, id_level, id_gym, id_tournament]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getByCategoryAndLevel(
    DataIds: GetScores
  ): Promise<FullScoreInfo[]> {
    try {
      const { id_category, id_level, id_tournament } = DataIds;
      const { rows } = await pool.query(
        "SELECT * FROM get_scores_by_category_and_level($1, $2, $3)",
        [id_category, id_level, id_tournament]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getByTournament(id: number): Promise<FullScoreInfo[]> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM get_scores_by_tournament($1)",
        [id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}
