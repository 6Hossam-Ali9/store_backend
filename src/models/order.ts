import client from "../database";

export type order = {
  id?: number;
  status: string;
  user_id: number;
};

export class OrderServices {
  public async createOrder(order: order): Promise<order | object> {
    try {
      const conn = await client.connect();
      const user = await conn.query("SELECT * FROM users WHERE id = $1", [
        order.user_id,
      ]);
      if (user.rows.length === 0) return { error: "User does not exist!" };
      const sql =
        "INSERT INTO orders(status, user_id) VALUES($1, $2) RETURNING *";
      const res = await conn.query(sql, [order.status, order.user_id]);
      conn.release();
      return res.rows[0];
    } catch (err) {
      return { error: err };
    }
  }

  public async getAllOrders(): Promise<order[] | object> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";
      const res = await conn.query(sql);
      conn.release();
      return res.rows;
    } catch (err) {
      return { error: err };
    }
  }

  public async getOrderById(id: number): Promise<order | object> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE id = $1";
      const res = await conn.query(sql, [id]);
      conn.release();
      return res.rows[0];
    } catch (err) {
      return { error: err };
    }
  }

  public async deleteOrder(id: number): Promise<order | object> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM orders WHERE id = $1 RETURNING *";
      const res = await conn.query(sql, [id]);
      conn.release();
      return res.rows[0];
    } catch (err) {
      return { error: err };
    }
  }
}
