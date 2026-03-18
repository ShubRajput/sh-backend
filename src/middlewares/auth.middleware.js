import jwt from "jsonwebtoken";

import envConfig from "../config/env.config.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Access token is missing or invalid.",
    });
  }

  jwt.verify(token, envConfig.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        status: 401,
        message: "Invalid or expired access token.",
      });
    }
    req.user = user;
    next();
  });
};

export const authorizeRoles = (requiredRoles = []) => {
  if (typeof requiredRoles === "string") {
    requiredRoles = [requiredRoles];
  }

  return (req, res, next) => {
    const userRoles = req.user.roles;

    // If no roles required, just check authentication
    if (!requiredRoles.length) return next();

    // Check if user has at least one of the required roles
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ status: 403, message: "Access denied." });
    }

    next();
  };
};
