import pool from "../db/db";
import type { User } from "../schemas/user.schema";

export default class userservice {
  public async getUsers(): Promise<User[]> {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
  }

  public async getUserById(id: number): Promise<User | undefined> {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE id_user = $1",
      [id]
    );
    return rows[0];
  }

  public async createUser(user: Omit<User, "id">): Promise<User> {
    const { full_name, email, password, id_role, membership_number } = user;
    const { rows } = await pool.query(
      "INSERT INTO users (full_name, email, password, id_role, membership_number) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [full_name, email, password, id_role, membership_number]
    );
    return rows[0];
  }

  public async updateUserFullname(
    id: number,
    user: Pick<User, "full_name">
  ): Promise<User | undefined> {
    const { full_name } = user;
    const { rows } = await pool.query(
      "UPDATE users SET full_name = $1 WHERE id_user = $2 RETURNING *",
      [full_name, id]
    );
    return rows[0];
  }

  public async deleteUser(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      "DELETE FROM users WHERE id_user = $1",
      [id]
    );
    return !!rowCount && rowCount > 0;
  }
}
