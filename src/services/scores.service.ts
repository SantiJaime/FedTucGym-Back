import { DatabaseError } from "pg";
import pool from "../database/db.config";
import { FullScoreInfo, Score } from "../schemas/scores.schema";

export default class ScoresService {
  public async create(data: Omit<Score, "id">): Promise<void> {
    try {
      const { id_member, id_tournament, puntaje } = data;
      await pool.query(
        "INSERT INTO puntajes (id_member, id_tournament, puntaje) VALUES ($1, $2, $3)",
        [id_member, id_tournament, puntaje]
      );
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

  public async getByTournament(id: number): Promise<FullScoreInfo[]> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM scores_view WHERE id_tournament = $1 ORDER BY puntaje DESC",
        [id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}
