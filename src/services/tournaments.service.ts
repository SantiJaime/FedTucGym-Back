import pool from "../db/db";
import type { Tournament } from "../schemas/tournaments.schema";

export default class TournamentService {
  public async getAll(): Promise<Tournament[]> {
    const { rows } = await pool.query("SELECT * FROM tournaments");
    return rows;
  }

  public async getById(id: number): Promise<Tournament | undefined> {
    const { rows } = await pool.query(
      "SELECT * FROM tournaments WHERE id = $1",
      [id]
    );
    return rows[0];
  }

  public async create(
    tournamentData: Omit<Tournament, "id_tournament">
  ): Promise<Tournament> {
    const { name, description, date_range } = tournamentData;

    const { rows } = await pool.query(
      "INSERT INTO tournaments (name, description, date_range) VALUES ($1, $2, $3) RETURNING *",
      [name, description, date_range]
    );
    return rows[0];
  }

  public async update(
    id: number,
    tournamentData: Omit<Tournament, "id_tournament">
  ): Promise<Tournament | undefined> {
    const { name, description, date_range } = tournamentData;

    const { rows } = await pool.query(
      "UPDATE tournaments SET name = $1, description = $2, date_range = $3 WHERE id_tournament = $4 RETURNING *",
      [name, description, date_range, id]
    );
    return rows[0];
  }

  public async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      "DELETE FROM tournaments WHERE id_tournament = $1",
      [id]
    );
    return !!rowCount && rowCount > 0;
  }
}
