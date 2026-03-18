import envConfig from "../../config/env.config.js";

export function apiPerformanceMiddleware(req, res, next) {
  const start = Date.now();

  const logResponseTime = () => {
    const debugLevel = envConfig.DEBUG;
    const duration = Date.now() - start;
    const dateAndTime = new Date().toISOString();
    const requestedIP =
      req.headers["x-real-ip"] || req.ip || req.connection.remoteAddress;
    if (debugLevel) {
      console.log(
        `${dateAndTime} [IP: ${requestedIP}] => API ${req.method} ${res.statusCode} ${req.originalUrl} took ${duration}ms`
      );
    }
  };

  res.on("finish", logResponseTime);

  next();
}
