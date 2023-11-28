import client from "../database";

export type Product = {
  id: number;
  name: string;
  price: number;
  category?: string;
};

export class ProductServices {
  public async createProduct(product: Product): Promise<Product | object> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO products(name, price, category) VALUES($1, $2, $3) RETURNING *";
      const res = await conn.query(sql, [
        product.name,
        product.price,
        product.category,
      ]);
      conn.release();
      return res.rows[0];
    } catch (err) {
      return { error: err };
    }
  }

  public async getAllProducts(): Promise<Product[] | object> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products";
      const res = await conn.query(sql);
      conn.release();
      return res.rows;
    } catch (err) {
      return { error: err };
    }
  }

  public async getProductById(id: number): Promise<Product | object> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products WHERE id = $1";
      const res = await conn.query(sql, [id]);
      conn.release();
      return res.rows[0];
    } catch (err) {
      return { error: err };
    }
  }

  public async getProductByCategory(
    category: string,
  ): Promise<Product[] | object> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products WHERE category = $1";
      const res = await conn.query(sql, [category]);
      conn.release();
      return res.rows;
    } catch (err) {
      return { error: err };
    }
  }

  public async deleteProduct(id: number): Promise<Product | object> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM products WHERE id = $1 RETURNING *";
      const res = await conn.query(sql, [id]);
      conn.release();
      return res.rows[0];
    } catch (err) {
      return { error: err };
    }
  }
}
