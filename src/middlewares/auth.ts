import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/AdminModels";
const jwtSecret = process.env.JWT_SECRET as string;

const auth = async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({ message: "Kindly sign in as an admin" });
    }

    const token = authorization.slice(7, authorization.length);
    const verify = jwt.verify(token, jwtSecret);

    if (!verify) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const { _id } = verify as { [key: string]: string };

    const admin = await Admin.findById(_id);

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }
    req.user = admin;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default auth;
