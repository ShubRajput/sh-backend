import jwt from "jsonwebtoken";

import envConfig from "../../config/env.config.js";

export const generateAdminAccessToken = (user) => {
  return jwt.sign(
    user,
    envConfig.ADMIN_JWT_SECRET,
    { expiresIn: "1d" } // Token expiration time
  );
};

export const generateAdminRefreshToken = (user, expiresIn) => {
  return jwt.sign(
    user,
    envConfig.ADMIN_REFRESH_JWT_SECRET,
    { expiresIn: expiresIn || "7d" } // Token expiration time
  );
};
