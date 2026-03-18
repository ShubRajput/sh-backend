import { databaseConnectivityCheckService } from "../services/system_meta_data.service.js";

export const getAPIHealth = async (req, res) => {
  try {
    const status = await databaseConnectivityCheckService();
    const healthStatus = {
      status: "healthy",
      uptime: process.uptime(),
      database: status ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    };
    res.status(200).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
