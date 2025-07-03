import pool from "../database/db.config";
import { MembersTournamentsView } from "../schemas/members_tournaments.schema";
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

  public async getByDate(): Promise<Tournament[]> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM tournaments WHERE inscription_date_end >= CURRENT_DATE ORDER BY inscription_date_end ASC"
      );
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
    tournamentData: Omit<Tournament, "id">
  ): Promise<Tournament> {
    try {
      const { name, date_range, inscriptionDateEnd } = tournamentData;

      const { rows } = await pool.query(
        "INSERT INTO tournaments (name, date_range, inscription_date_end) VALUES ($1, $2, $3) RETURNING *",
        [name, date_range, inscriptionDateEnd]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async update(
    id: number,
    tournamentData: Omit<Tournament, "id">
  ): Promise<Tournament | undefined> {
    try {
      const { name, date_range, inscriptionDateEnd } = tournamentData;
      const { rows } = await pool.query(
        "UPDATE tournaments SET name = $1, date_range = $2, inscription_date_end = $3 WHERE id = $4 RETURNING *",
        [name, date_range, inscriptionDateEnd, id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM tournaments WHERE id = $1",
        [id]
      );
      return !!rowCount && rowCount > 0;
    } catch (error) {
      throw error;
    }
  }
  public async getMembersTournament(
    id_gym: number,
    id_tournament: number
  ): Promise<MembersTournamentsView[]> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM members_tournaments_view WHERE id_tournament = $1 AND id_gym = $2",
        [id_tournament, id_gym]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getMembersNotInTournament(
    id_gym: number,
    id_tournament: number
  ): Promise<FullMemberInfo[]> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM members_view WHERE id NOT IN (SELECT id_member FROM members_tournaments WHERE id_tournament = $1) AND id_gym = $2",
        [id_tournament, id_gym]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}
