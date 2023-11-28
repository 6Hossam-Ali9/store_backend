import express, { Request, Response } from "express";
import { ProductServices } from "../models/product";
import validateToken from "../middlewares/Auth";

const prod = new ProductServices();

const index = async (_req: Request, res: Response) => {
  const products = await prod.getAllProducts();
  res.json(products);
};

const create = async (req: Request, res: Response) => {
  const product = await prod.createProduct(req.body);
  res.json(product);
};

const show = async (req: Request, res: Response) => {
  const product = await prod.getProductById(parseInt(req.params.id));
  res.json(product);
};

const byCategory = async (req: Request, res: Response) => {
  const products = await prod.getProductByCategory(req.body.category);
  res.json(products);
};

const deleteProduct = async (req: Request, res: Response) => {
  const product = await prod.deleteProduct(parseInt(req.params.id));
  res.json(product);
};

const productsRoutes = (app: express.Application) => {
  app.get("/products", index); // Required
  app.get("/products/category", byCategory); // Required optional
  app.get("/products/:id", show); // Required
  app.post("/products", validateToken, create); // Required
  app.delete("/products/:id", deleteProduct);
};

export default productsRoutes;
