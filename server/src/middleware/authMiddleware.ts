import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401).json({ message: "Not authorized, user not found" });
        return;
      }

      req.user = user as IUser;
      next();
      return;
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
      return;
    }
  }

  // If no token found anywhere
  res.status(401).json({ message: "Not authorized, no token" });
};

// Admin middleware stays the same
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};