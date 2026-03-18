import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";

import envConfig from "../config/env.config.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    user,
    envConfig.JWT_SECRET,
    { expiresIn: "1d" } // Token expiration time
  );
};

export const generateRefreshToken = (user, expiresIn) => {
  return jwt.sign(
    user,
    envConfig.REFRESH_JWT_SECRET,
    { expiresIn: expiresIn || "7d" } // Token expiration time
  );
};

export const generateUniqueToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    envConfig.JWT_UNIQUE,
    { expiresIn: "1d" } // Token expiration time
  );
};

export const generateRandomUniqueToken = (length = 50) => {
  return randomBytes(length).toString("hex");
};
