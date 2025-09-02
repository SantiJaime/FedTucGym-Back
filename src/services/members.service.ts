import { DatabaseError, type QueryResult } from "pg";
import pool from "../database/db.config";
import type { Member } from "../schemas/members.shema";
import { calcularEdadYCategoriaAl31Dic } from "../utils/categories";
import { MembersTournaments } from "../schemas/members_tournaments.schema";

export const actualizarCategoriasMiembros = async (): Promise<void> => {
  const { rows: miembros } = await pool.query(
    "SELECT id, birth_date FROM members"
  );
  for (const miembro of miembros) {
    const { id_category } = calcularEdadYCategoriaAl31Dic(miembro.birth_date);
    await pool.query("UPDATE members SET id_category = $1 WHERE id = $2", [
      id_category,
      miembro.id,
    ]);
  }
};

export const borrarInscripcionesSinPago = async (): Promise<void> => {
  await pool.query(`
    DELETE FROM members_tournaments mt
    USING tournaments t
    WHERE mt.id_tournament = t.id
      AND mt.paid = false
      AND CURRENT_DATE > t.inscription_date_end
  `);
};

export default class MembersService {
  public async getAll(): Promise<FullMemberInfo[]> {
    try {
      const { rows } = await pool.query("SELECT * FROM members_view");
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: number): Promise<Member | undefined> {
    try {
      const { rows } = await pool.query("SELECT * FROM members WHERE id = $1", [
        id,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async getByGymId(
    query: string,
    values: any[],
    countQuery: string,
    countValues: any[]
  ): Promise<{ data: FullMemberInfo[]; total: number }> {
    try {
      const [dataResult, countResult]: [
        QueryResult<FullMemberInfo>,
        QueryResult<{ count: string }>
      ] = await Promise.all([
        pool.query(query, values),
        pool.query(countQuery, countValues),
      ]);

      const data = dataResult.rows;
      const total = parseInt(countResult.rows[0].count, 10);

      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  public async create(member: CreateMember): Promise<Member> {
    try {
      const { full_name, birth_date, id_gym, dni, id_level, age, id_category } =
        member;

      const { rows } = await pool.query(
        "INSERT INTO members (full_name, birth_date, age, id_category, id_gym, dni, id_level) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [full_name, birth_date, age, id_category, id_gym, dni, id_level]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async update(
    id: number,
    member: CreateMember
  ): Promise<Member | undefined> {
    try {
      const { full_name, birth_date, age, id_category } = member;
      const { rows } = await pool.query(
        "UPDATE members SET full_name = $1, birth_date = $2, age = $3, id_category = $4 WHERE id = $5 RETURNING *",
        [full_name, birth_date, age, id_category, id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM members WHERE id = $1",
        [id]
      );
      return !!rowCount && rowCount > 0;
    } catch (error) {
      throw error;
    }
  }

  public async registerToTournament(
    memberId: number,
    tournamentId: number
  ): Promise<MembersTournaments> {
    try {
      const { rows } = await pool.query(
        "INSERT INTO members_tournaments (id_member, id_tournament) VALUES ($1, $2) RETURNING *",
        [memberId, tournamentId]
      );
      return rows[0];
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === "23505") {
          throw new Error("El alumno ya está registrado en el torneo");
        } else if (error.code === "23503") {
          throw new Error("No se encontró al alumno con la ID proporcionada");
        } else if (error.code === "23502") {
          throw new Error("No se encontró el torneo con la ID proporcionada");
        }
      }
      throw new Error("Error de base de datos desconocido");
    }
  }
}
