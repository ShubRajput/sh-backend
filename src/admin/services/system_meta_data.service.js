import { databaseConnectivityCheckModel } from "../models/system_meta_data.model.js";

export const databaseConnectivityCheckService = async () => {
  try {
    const isConnected = await databaseConnectivityCheckModel();
    return isConnected;
  } catch (error) {
    console.error("Database connectivity check failed:", error);
    return false;
  }
};
