import pool from "../database/db.config";
import type { Tournament } from "../schemas/tournaments.schema";

export default class TournamentService {
  public async getAll(): Promise<Tournament[]> {
    try {
      const { rows } = await pool.query("SELECT * FROM tournaments");
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: number): Promise<Tournament | undefined> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM tournaments WHERE id = $1",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async create(
    tournamentData: Omit<Tournament, "id_tournament">
  ): Promise<Tournament> {
    try {
      const { name, description, date_range } = tournamentData;

      const { rows } = await pool.query(
        "INSERT INTO tournaments (name, description, date_range) VALUES ($1, $2, $3) RETURNING *",
        [name, description, date_range]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async update(
    id: number,
    tournamentData: Omit<Tournament, "id_tournament">
  ): Promise<Tournament | undefined> {
    try {
      const { name, description, date_range } = tournamentData;

      const { rows } = await pool.query(
        "UPDATE tournaments SET name = $1, description = $2, date_range = $3 WHERE id_tournament = $4 RETURNING *",
        [name, description, date_range, id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM tournaments WHERE id_tournament = $1",
        [id]
      );
      return !!rowCount && rowCount > 0;
    } catch (error) {
      throw error;
    }
  }
}
