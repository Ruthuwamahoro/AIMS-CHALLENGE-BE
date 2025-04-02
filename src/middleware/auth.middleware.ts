import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { RoleType } from "../models/role.model";

interface DecodedToken extends JwtPayload {
  identifier: string;
}

export interface AuthRequest extends Request {
  user?: any;
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as DecodedToken;

    User.findOne({
      $or: [{ email: decoded.identifier }, { username: decoded.identifier }],
    })
      .select("-password")
      .then((user) => {
        if (!user) {
          res.status(401).json({ message: "User not found" });
          return;
        }
        (req as AuthRequest).user = user;
        next();
      })
      .catch((error) => {
        res.status(401).json({ message: "Invalid token" });
      });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (authReq.user.role !== RoleType.ADMIN) {
      res.status(403).json({ message: "Admin access required" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
