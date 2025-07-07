import pool from "../database/db.config";
import {
  GetMembersTournamentByGym,
  GetMembersTournaments,
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
  public async getMembersTournamentByGym(
    parsedIds: GetMembersTournamentByGym
  ): Promise<MembersTournamentsView[]> {
    try {
      const { id_tournament, id_category, id_level, id_gym } = parsedIds;
      const { rows } = await pool.query(
        "SELECT * FROM get_members_tournaments_by_gym($1, $2, $3, $4);",
        [id_tournament, id_category, id_level, id_gym]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getMembersTournamentByCategoryAndLevel(
    parsedIds: GetMembersTournaments
  ): Promise<MembersTournamentsView[]> {
    try {
      const { id_tournament, id_category, id_level } = parsedIds;
      const { rows } = await pool.query(
        "SELECT * FROM get_members_tournaments_by_category_and_level($1, $2, $3);",
        [id_tournament, id_category, id_level]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getMembersNotInTournament(
    parsedIds: GetMembersTournamentByGym
  ): Promise<FullMemberInfo[]> {
    try {
      const { id_tournament, id_gym, id_category, id_level } = parsedIds;
      const { rows } = await pool.query(
        "SELECT * FROM get_available_members_for_tournament($1, $2, $3, $4)",
        [id_tournament, id_category, id_level, id_gym]
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
