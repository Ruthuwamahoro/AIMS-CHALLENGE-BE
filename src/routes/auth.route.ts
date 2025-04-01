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
  const { username, email, gender, telephone, password } = req.body;

  if (!username || !email || !gender || !telephone || !password) {
    res.status(400).json({
      status: 400,
      message: i18next.t("common.error.missing_fields", {
        lng: (req as AuthenticatedRequest).language || "en",
      }),
      data: null,
    });
    return;
  }

  try {
    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email }),
    ]);

    if (existingUsername) {
      res.status(400).json({
        status: 400,
        message: i18next.t("auth.register.username_taken", {
          lng: (req as AuthenticatedRequest).language || "en",
        }),
        data: null,
      });
      return;
    }

    if (existingEmail) {
      res.status(400).json({
        status: 400,
        message: i18next.t("auth.register.email_registered", {
          lng: (req as AuthenticatedRequest).language || "en",
        }),
        data: null,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      gender,
      telephone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      status: 201,
      message: i18next.t("auth.register.success", {
        lng: (req as AuthenticatedRequest).language || "en",
      }),
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: i18next.t("auth.register.error", {
        lng: (req as AuthenticatedRequest).language || "en",
      }),
      data: null,
    });
  }
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: Error | null, user: any, info: { message: string }) => {
      if (err) return next(err);
      if (!user) {
        res.status(400).json({
          status: 400,
          message: info.message,
          data: null,
        });
        return;
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "8h",
      });

      res.status(200).json({
        status: 200,
        message: i18next.t("auth.login.success", {
          lng: (req as AuthenticatedRequest).language || "en",
        }),
        data: token,
      });
    }
  )(req, res, next);
});

export default router;
