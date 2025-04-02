import express, { Request, Response, NextFunction, Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { i18next } from "../config/i18next";
import dotenv from "dotenv";

dotenv.config();

interface AuthenticatedRequest extends Request {
  language?: string;
  user?: any;
}

const router: Router = express.Router();

passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (
      email: string,
      password: string,
      done: (error: any, user?: any, options?: any) => void
    ) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, {
            message: i18next.t("common.error.invalid_email"),
          });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, {
            message: i18next.t("common.error.invalid_password"),
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (error: any, id?: any) => void) => {
  done(null, user.id);
});

passport.deserializeUser(
  async (id: string, done: (error: any, user?: any) => void) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
);

router.post("/signup", async (req: Request, res: Response) => {
  const { username, fullName, email, gender, telephone, password } = req.body;

  if (!username || !fullName || !email || !gender || !telephone || !password) {
    res.status(400).json({
      status: 400,
      message: "missing fields",
      data: null,
    });
    return;
  }

  console.log("password", password)

  try {
    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email }),
    ]);

    if (existingUsername) {
      res.status(400).json({
        status: 400,
        message:"Username already taken",
        data: null,
      });
      return;
    }

    if (existingEmail) {
      res.status(400).json({
        status: 400,
        message: "Email already exists",
        data: null,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      fullName,
      email,
      gender,
      telephone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      status: 201,
      message: "User successfully registered",
      data: null,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      status: 500,
      message: err.message,
      data: null,
    });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      {
        id: user._id,
        identifier: identifier,
        role: user.role, // Add role to token payload
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
