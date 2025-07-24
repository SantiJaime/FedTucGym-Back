import { QueryResult } from "pg";
import pool from "../database/db.config";
import {
  GetMembersTournamentByGym,
  GetMembersTournaments,
  MembersTournamentsView,
  ScoresMembersTournaments,
  UpdatePaidMembersTournaments,
} from "../schemas/members_tournaments.schema";
import type {
  CreateTournament,
  Tournament,
} from "../schemas/tournaments.schema";

import cron from "node-cron";
import { sheetsService } from "./index.service";

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
      const { rows }: QueryResult<Tournament> = await pool.query(
        "SELECT * FROM tournaments WHERE inscription_date_end >= CURRENT_DATE ORDER BY inscription_date_end ASC"
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  public async getPastByDate(): Promise<Tournament[]> {
    try {
      const { rows }: QueryResult<Tournament> = await pool.query(
        "SELECT * FROM tournaments WHERE inscription_date_end < CURRENT_DATE ORDER BY LOWER(date_range) DESC"
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: number): Promise<Tournament | undefined> {
    try {
      const { rows }: QueryResult<Tournament> = await pool.query(
        "SELECT name FROM tournaments WHERE id = $1",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async create(
    tournamentData: CreateTournament & { inscriptionDateEnd: string }
  ): Promise<Tournament> {
    try {
      const { name, startDate, endDate, inscriptionDateEnd } = tournamentData;

      const { rows }: QueryResult<Tournament> = await pool.query(
        "INSERT INTO tournaments (name, date_range, inscription_date_end) VALUES ($1, daterange($2, $3, '[]'), $4) RETURNING *",
        [name, startDate, endDate, inscriptionDateEnd]
      );
      const newTournament = rows[0];
      const [year, month, day] = startDate.split("-").map(Number);

      const cronExpression = `0 3 ${day} ${month} *`;

      cron.schedule(cronExpression, async () => {
        const now = new Date();
        if (now.getFullYear() === year) {
          try {
            await sheetsService.exportTournamentToSheet(newTournament.id);
            console.log(
              `✅ Exportación automática del torneo ${newTournament.name} completada`
            );
          } catch (error) {
            if (error instanceof Error) {
              throw new Error(error.message);
            }
            throw new Error(
              "Error desconocido al cargar torneo en hoja de cálculo"
            );
          }
        }
      });

      return newTournament;
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
    parsedIds: GetMembersTournamentByGym,
    offset: number
  ): Promise<MembersTournamentsView[]> {
    try {
      const { id_tournament, id_category, id_level, id_gym } = parsedIds;
      const { rows }: QueryResult<MembersTournamentsView> = await pool.query(
        "SELECT * FROM get_members_tournaments_by_gym($1, $2, $3, $4, $5, $6);",
        [id_tournament, id_category, id_level, id_gym, 20, offset]
      );
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async getAllMembersByTournament(id_tournament: number): Promise<{
    membersTournaments: ScoresMembersTournaments[];
    tournamentName: string;
  }> {
    try {
      const [tournamentNameResult, membersResult]: [
        QueryResult<{ name: string }>,
        QueryResult<ScoresMembersTournaments>
      ] = await Promise.all([
        pool.query("SELECT name FROM tournaments WHERE id = $1", [
          id_tournament,
        ]),
        pool.query("SELECT * FROM get_members_tournaments($1)", [
          id_tournament,
        ]),
      ]);
      
      const tournamentName = tournamentNameResult.rows[0].name || "";
      return {
        tournamentName,
        membersTournaments: membersResult.rows,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getMembersTournamentByCategoryAndLevel(
    parsedIds: GetMembersTournaments,
    offset: number
  ): Promise<MembersTournamentsView[]> {
    try {
      const { id_tournament, id_category, id_level } = parsedIds;
      const { rows }: QueryResult<MembersTournamentsView> = await pool.query(
        "SELECT * FROM get_members_tournaments_by_category_and_level($1, $2, $3, $4, $5);",
        [id_tournament, id_category, id_level, 20, offset]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getMembersNotInTournament(
    parsedIds: GetMembersTournamentByGym,
    offset: number
  ): Promise<FullMemberInfo[]> {
    try {
      const { id_tournament, id_gym, id_category, id_level } = parsedIds;
      const { rows }: QueryResult<FullMemberInfo> = await pool.query(
        "SELECT * FROM get_available_members_for_tournament($1, $2, $3, $4, $5, $6);",
        [id_tournament, id_category, id_level, id_gym, 20, offset]
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
