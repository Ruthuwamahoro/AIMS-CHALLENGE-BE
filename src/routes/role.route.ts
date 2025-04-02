import express from "express";
import { Role } from "../models/role.model";
import {
  isAuthenticated,
  isAdmin,
  AuthRequest,
} from "../middleware/auth.middleware";
import User from "../models/user.model";

const RoleRouter = express.Router();


RoleRouter.patch(
  "/assign/:userId",
  isAuthenticated,
  isAdmin,
  async (req: AuthRequest, res: express.Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!userId || !role) {
        res.status(400).json({ message: "User ID and role are required" });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      user.role = role;
      await user.save();

      res.status(200).json({
        message: "Role assigned successfully",
        user,
      });
    } catch (error: unknown) {
        const err = error as Error;
      res.status(500).json({
        message: "Error assigning role",
        error: err.message,
      });
    }
  }
);

export default RoleRouter;
