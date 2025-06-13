import pool from "../database/db.config";
import type { User } from "../schemas/users.schema";

export default class userservice {
  public async getAll(): Promise<User[]> {
    try {
      const { rows } = await pool.query("SELECT * FROM users");
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getByEmail(email: string): Promise<User | undefined> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: number): Promise<User | undefined> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE id_user = $1",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async create(user: Omit<User, "id">): Promise<User> {
    try {
      const { full_name, email, password, id_role } = user;
      const { rows } = await pool.query(
        "INSERT INTO users (full_name, email, password, id_role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [full_name, email, password, id_role]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async updateFullname(
    id: number,
    user: Pick<User, "full_name">
  ): Promise<User | undefined> {
    try {
      const { full_name } = user;
      const { rows } = await pool.query(
        "UPDATE users SET full_name = $1 WHERE id_user = $2 RETURNING *",
        [full_name, id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const { rowCount } = await pool.query(
        "DELETE FROM users WHERE id_user = $1",
        [id]
      );
      return !!rowCount && rowCount > 0;
    } catch (error) {
      throw error;
    }
  }
}
