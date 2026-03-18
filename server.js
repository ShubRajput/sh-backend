import app from "./app.js";
import db from "./src/config/db.config.js";
import EnvData from "./src/config/env.config.js";
import startPriestEarningsCron from "./src/jobs/autoPriestEarning.job.js";

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();

    startPriestEarningsCron();

    app.listen(EnvData.PORT, () => {
      console.log(`🚀 Server running on port ${EnvData.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error.message);
    process.exit(1);
  }
})();
