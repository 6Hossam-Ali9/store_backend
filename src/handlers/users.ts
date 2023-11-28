import express, { Request, Response } from "express";
import { UserServices } from "../models/user";
import validateToken from "../middlewares/Auth";

const dev = new UserServices();

const index = async (_req: Request, res: Response) => {
  const users = await dev.getAllUsers();
  res.json(users);
};

const create = async (req: Request, res: Response) => {
  const user = await dev.createUser(req.body);
  res.json(user);
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const token = await dev.loginUser(username, password);
  res.json(token);
};

const show = async (req: Request, res: Response) => {
  const user = await dev.getUserById(parseInt(req.params.id));
  res.json(user);
};

const del = async (req: Request, res: Response) => {
  const user = await dev.deleteUser(parseInt(req.params.id));
  res.json(user);
};

const usersRoutes = (app: express.Application) => {
  app.get("/users", validateToken, index); // Required
  app.get("/users/:id", validateToken, show); // Required
  app.post("/signup", create); // Required
  app.post("/login", login); // Required for generating a token
  app.delete("/users/:id", del);
};

export default usersRoutes;
