import cron from "node-cron";

import { autoInsertPriestEarningsJobService } from "../services/priest_earning.service.js";

export default function startPriestEarningsCron() {
  // Schedule job to run every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("⏰ Running scheduled job: Auto insert priest earnings job");
      await autoInsertPriestEarningsJobService();
      console.log("✅ Scheduled job completed successfully");
    } catch (err) {
      console.error("❌ Scheduled job failed:", err.message);
    }
  });
}
