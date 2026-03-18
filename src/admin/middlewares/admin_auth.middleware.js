import jwt from "jsonwebtoken";

import envConfig from "../../config/env.config.js";

export const authenticateAdminToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Access token is missing or invalid.",
    });
  }

  jwt.verify(token, envConfig.ADMIN_JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        status: 401,
        message: "Invalid or expired access token.",
      });
    }
    req.admin = user;
    next();
  });
};
