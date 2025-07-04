import pool from "../database/db.config";
import {
  MembersTournamentsView,
  UpdatePaidMembersTournaments,
} from "../schemas/members_tournaments.schema";
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
        "SELECT * FROM get_members_tournaments($1, $2);",
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
        "SELECT mv.* FROM members_view mv LEFT JOIN members_tournaments mt ON mv.id = mt.id_member AND mt.id_tournament = $1 WHERE mt.id_member IS NULL AND mv.id_gym = $2",
        [id_tournament, id_gym]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async updatePayTournament(
    data: UpdatePaidMembersTournaments
  ): Promise<boolean> {
    try {
      const { id_member, id_tournament, paid } = data;
      const { rowCount } = await pool.query(
        "UPDATE members_tournaments SET paid = $1 WHERE id_member = $2 AND id_tournament = $3",
        [paid, id_member, id_tournament]
      );
      return !!rowCount && rowCount > 0;
    } catch (error) {
      throw error;
    }
  }
}
