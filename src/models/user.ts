import { sign } from "jsonwebtoken";
import client from "../database";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
export type User = {
  id: number;
  first_name: string;
  last_name: string;
  password: string;
};

dotenv.config();

export class UserServices {
  public async createUser(user: User): Promise<User | object> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO users(first_name, last_name, password) VALUES($1, $2, $3) RETURNING *";
      const hash = await bcrypt.hashSync(
        user.password,
        parseInt(process.env.ROUNDS as string),
      );
      const res = await conn.query(sql, [
        user.first_name,
        user.last_name,
        hash,
      ]);
      conn.release();
      return res.rows[0];
    } catch (err) {
      return { error: err };
    }
  }

  public async loginUser(
    username: string,
    password: string,
  ): Promise<object | string> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users WHERE first_name = $1";
      const res = await conn.query(sql, [username]);
      if (res.rows.length) {
        const hash = await bcrypt.compareSync(password, res.rows[0].password);
        const user = res.rows[0];
        if (hash) {
          const accessToken = sign(
            { username: user.first_name, id: user.id },
            process.env.SECRET as string,
          );
          return {
            accessToken: accessToken,
          };
        } else {
          return { error: "Invalid password!" };
        }
      }
      conn.release();
      return res.rows;
    } catch (err) {
      return { error: err };
    }
  }

  public async getAllUsers(): Promise<User[] | object> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users";
      const res = await conn.query(sql);
      conn.release();
      return res.rows;
    } catch (err) {
      return { error: err };
    }
  }

  public async getUserById(id: number): Promise<User | object> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users WHERE id = $1";
      const res = await conn.query(sql, [id]);
      conn.release();
      return res.rows[0];
    } catch (err) {
      return { error: err };
    }
  }

  public async deleteUser(id: number): Promise<User | object> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM users WHERE id = $1 RETURNING *";
      const res = await conn.query(sql, [id]);
      conn.release();
      return res.rows[0];
    } catch (err) {
      return { error: err };
    }
  }
}
