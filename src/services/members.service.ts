import { DatabaseError } from "pg";
import pool from "../database/db.config";
import type { Member } from "../schemas/members.shema";

export default class MembersService {
  public async getAll(): Promise<Member[]> {
    try {
      const { rows } = await pool.query("SELECT * FROM members");
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: number): Promise<Member | undefined> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM members WHERE id_member = $1",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async getByGymId(id: number): Promise<Member[]> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM members WHERE id_gym = $1",
        [id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async create(member: Omit<Member, "id">): Promise<Member> {
    try {
      const { full_name, birth_date, age, category, id_gym } = member;
      const { rows } = await pool.query(
        "INSERT INTO members (full_name, birth_date, age, category, id_gym) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [full_name, birth_date, age, category, id_gym]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async update(
    id: number,
    member: Omit<Member, "id">
  ): Promise<Member | undefined> {
    try {
      const { full_name, birth_date, age, category, id_gym } = member;
      const { rows } = await pool.query(
        "UPDATE members SET full_name = $1, birth_date = $2, age = $3, category = $4, id_gym = $5 WHERE id_member = $6 RETURNING *",
        [full_name, birth_date, age, category, id_gym, id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM members WHERE id_member = $1",
        [id]
      );
      return !!rowCount && rowCount > 0;
    } catch (error) {
      throw error;
    }
  }

  public async registerToTournament(memberId: number, tournamentId: number) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO members_tournaments (id_member, id_tournament) VALUES ($1, $2, $3) RETURNING *",
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
