import express from "express";
import {
  isAuthenticated,
  isAdmin,
  AuthRequest,
} from "../middleware/auth.middleware";
import User from "../models/user.model";

const UserRouter = express.Router();

UserRouter.get(
  "/users",
  isAuthenticated,
  isAdmin,
  async (_req: AuthRequest, res: express.Response): Promise<void> => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json({
        message: "Users retrieved successfully",
        users,
      });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(500).json({
        message: "Error retrieving users",
        error: err.message,
      });
    }
  }
);

export default UserRouter;
