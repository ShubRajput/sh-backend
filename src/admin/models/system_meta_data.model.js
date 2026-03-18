import pool from "../../config/db.config.js";

export const databaseConnectivityCheckModel = async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    return rows.length > 0;
  } catch (error) {
    console.error("Database connectivity check failed:", error);
    return false;
  }
};
