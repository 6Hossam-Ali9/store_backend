import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ error: "No accessToken provided!" });

  try {
    const validToken = verify(accessToken, process.env.SECRET as string);
    if (validToken) {
      return next();
    }
  } catch (err) {
    res.json({ error: err });
  }
};

export default validateToken;
