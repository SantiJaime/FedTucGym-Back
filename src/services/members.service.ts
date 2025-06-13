import { DatabaseError } from "pg";
import pool from "../database/db.config";
import type { DateType } from "../schemas/date.schema";
import type { Member } from "../schemas/members.shema";

export default class MembersService {
  public async getAll(userId: number): Promise<Member[]> {
    const gym = await pool.query("SELECT id FROM gyms WHERE id_user = $1", [
      userId,
    ]);

    const { rows } = await pool.query(
      "SELECT * FROM members WHERE id_gym = $1",
      [gym.rows[0].id]
    );
    return rows;
  }

  public async getById(id: number): Promise<Member | undefined> {
    const { rows } = await pool.query(
      "SELECT * FROM members WHERE id_member = $1",
      [id]
    );
    return rows[0];
  }

  public async create(member: Omit<Member, "id">): Promise<Member> {
    const { full_name, email, membership_number } = member;
    const { rows } = await pool.query(
      "INSERT INTO members (full_name, email, membership_number) VALUES ($1, $2, $3) RETURNING *",
      [full_name, email, membership_number]
    );
    return rows[0];
  }

  public async update(
    id: number,
    member: Pick<Member, "full_name" | "email">
  ): Promise<Member | undefined> {
    const { full_name, email } = member;
    const { rows } = await pool.query(
      "UPDATE members SET full_name = $1, email = $2 WHERE id_member = $3 RETURNING *",
      [full_name, email, id]
    );
    return rows[0];
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

  public async registerToTournament(
    memberId: number,
    tournamentId: number,
    inscriptionDate: DateType
  ) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO members_tournaments (id_member, id_tournament, inscription_date) VALUES ($1, $2, $3) RETURNING *",
        [memberId, tournamentId, inscriptionDate]
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
      throw error;
    }
  }
}
