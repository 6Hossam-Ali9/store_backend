import express, { Request, Response } from "express";
import { OrderServices } from "../models/order";
import client from "../database";
import validateToken from "../middlewares/Auth";

const ord = new OrderServices();

type RawOrderData = {
  order_id: number;
  status: string;
  quantity: number;
  product_id: number;
  name: string;
  price: string;
  category: string;
};

type OrderDetail = {
  quantity: number;
  product_id: number;
  name: string;
  price: string;
  category: string;
};

type Order = {
  order_id: number;
  status: string;
  details: OrderDetail[];
};

type OrderResponse = {
  orders: Order[];
};

const index = async (req: Request, res: Response) => {
  try {
    const orders = await ord.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const order = await ord.createOrder(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const order = await ord.getOrderById(parseInt(req.params.id));
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const del = async (req: Request, res: Response) => {
  try {
    const order = await ord.deleteOrder(parseInt(req.params.id));
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

//extra service methods

const formatOrderResponse = (data: RawOrderData[]): OrderResponse => {
  //This function is called to format the orders of the user
  const orders: Order[] = data.reduce((acc: Order[], item) => {
    const order: Order | undefined = acc.find(
      (o) => o.order_id === item.order_id,
    );

    if (order) {
      order.details.push({
        quantity: item.quantity,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        category: item.category,
      });
    } else {
      acc.push({
        order_id: item.order_id,
        status: item.status,
        details: [
          {
            quantity: item.quantity,
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            category: item.category,
          },
        ],
      });
    }

    return acc;
  }, []);

  return { orders };
};

const addProduct = async (req: Request, res: Response) => {
  const product_id: number = req.body.product_id;
  const quantity: number = req.body.quantity ?? 1;
  const order_id: number = parseInt(req.params.id);

  try {
    const conn = await client.connect();
    const sql = `INSERT INTO order_products (product_id, quantity, order_id) VALUES ($1, $2, $3) RETURNING *`;
    const result = await conn.query(sql, [product_id, quantity, order_id]);
    conn.release();
    res.json(result.rows[0]);
  } catch (err) {
    res.json({ error: err });
  }
};

const orderDetails = async (req: Request, res: Response) => {
  const order_id: number = parseInt(req.params.id);
  try {
    const conn = await client.connect();
    const sql = `SELECT * FROM order_products WHERE order_id = $1`;
    const result = await conn.query(sql, [order_id]);
    conn.release();
    res.json(result.rows);
  } catch (err) {
    res.json({ error: err });
  }
};

const getAllOrdersByUserId = async (req: Request, res: Response) => {
  const user_id: number = parseInt(req.params.id);
  try {
    const conn = await client.connect();
    const sql = `SELECT orders.id AS order_id,
          orders.status,
          order_products.quantity,
          products.id AS product_id,
          products.name,
          products.price,
          products.category
          FROM orders
          JOIN order_products ON orders.id = order_products.order_id
          JOIN products ON order_products.product_id = products.id WHERE orders.user_id = $1;`;
    const result = await conn.query(sql, [user_id]);
    conn.release();
    res.json(formatOrderResponse(result.rows));
  } catch (err) {
    res.json({ error: err });
  }
};

const getAllCompleteOrdersByUserId = async (req: Request, res: Response) => {
  const user_id: number = parseInt(req.params.id);
  try {
    const conn = await client.connect();
    const sql = `SELECT orders.id AS order_id,
          orders.status,
          order_products.quantity,
          products.id AS product_id,
          products.name,
          products.price,
          products.category
          FROM orders
          JOIN order_products ON orders.id = order_products.order_id
          JOIN products ON order_products.product_id = products.id WHERE orders.user_id = $1 AND orders.status = 'complete';`;
    const result = await conn.query(sql, [user_id]);
    conn.release();
    res.json(formatOrderResponse(result.rows));
  } catch (err) {
    res.json({ error: err });
  }
};

const ordersRoutes = (app: express.Application) => {
  app.get("/orders", index);
  app.get("/orders/:id/products", orderDetails);
  app.get("/orders/:id", show);
  app.get("/orders/users/:id", validateToken, getAllOrdersByUserId); //Required
  app.get(
    "/orders/complete/users/:id",
    validateToken,
    getAllCompleteOrdersByUserId,
  ); //Required optional
  app.post("/orders", create);
  app.post("/orders/:id/products", addProduct);
  app.delete("/orders/:id", del);
};

export default ordersRoutes;
