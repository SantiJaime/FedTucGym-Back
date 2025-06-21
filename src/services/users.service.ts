import pool from "../database/db.config";
import type { User } from "../schemas/users.schema";

export default class UserService {
  public async getAll(): Promise<UserResponse[]> {
    try {
      const { rows } = await pool.query("SELECT * FROM users_view");
      return rows;
    } catch (error) {
      throw error;
    }
  }

  public async getByName(full_name: string): Promise<UserResponse | undefined> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE full_name = $1",
        [full_name]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: number): Promise<UserResponse | undefined> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users_view WHERE id = $1",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async create(user: Omit<User, "id">): Promise<Omit<User, "password">> {
    try {
      const { full_name, password, id_role } = user;
      const { rows } = await pool.query(
        "INSERT INTO users (full_name, password, id_role) VALUES ($1, $2, $3) RETURNING id, full_name, id_role",
        [full_name, password, id_role]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  public async updateFullname(
    id: number,
    user: Pick<User, "full_name">
  ): Promise<Omit<User, "password"> | undefined> {
    try {
      const { full_name } = user;
      const { rows } = await pool.query(
        "UPDATE users SET full_name = $1 WHERE id_user = $2 RETURNING id, full_name, id_role",
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

  public async saveToken(token: string, id: number): Promise<void> {
    try {
      const createdAt = new Date();
      const expiresAt = new Date(
        createdAt.getTime() + 24 * 60 * 60 * 1000
      ).toISOString();

      await pool.query(
        "DELETE FROM refresh_tokens WHERE id_user = $1 AND expires_at <= NOW()",
        [id]
      );

      await pool.query(
        "INSERT INTO refresh_tokens (token, id_user, created_at, expires_at) VALUES ($1, $2, $3, $4)",
        [token, id, createdAt, expiresAt]
      );
    } catch (error) {
      throw error;
    }
  }

  public async validateToken(token: string, id: number): Promise<boolean> {
    try {
      const { rowCount } = await pool.query(
        "SELECT * FROM refresh_tokens WHERE token = $1 AND id_user = $2 AND expires_at > NOW()",
        [token, id]
      );

      return !!rowCount && rowCount > 0;
    } catch (error) {
      throw error;
    }
  }
}
