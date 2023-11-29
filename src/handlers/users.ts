import express, { Request, Response } from "express";
import { UserServices } from "../models/user";
import validateToken from "../middlewares/Auth";

const dev = new UserServices();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await dev.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user = await dev.createUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const token = await dev.loginUser(username, password);
    res.json(token);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await dev.getUserById(parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const del = async (req: Request, res: Response) => {
  try {
    const user = await dev.deleteUser(parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const usersRoutes = (app: express.Application) => {
  app.get("/users", validateToken, index); // Required
  app.get("/users/:id", validateToken, show); // Required
  app.post("/signup", create); // Required
  app.post("/login", login); // Required for generating a token
  app.delete("/users/:id", del);
};

export default usersRoutes;
