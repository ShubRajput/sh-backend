import express from "express";

import {
  getFinanceDashboardData,
  getPriestPaymentStatusDetailsList,
  getPriestPaymentSummeryDetails,
  getUsersSalesData,
  updatePriestEarningPaymentStatus,
} from "../controllers/admin_sh_finance.controller.js";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";

const router = express.Router();

router.get("/income", authenticateAdminToken, getFinanceDashboardData);
router.get("/users-sales", authenticateAdminToken, getUsersSalesData);
router.get(
  "/priest-payment-summary",
  authenticateAdminToken,
  getPriestPaymentSummeryDetails
);
router.get(
  "/priest-payment-status",
  authenticateAdminToken,
  getPriestPaymentStatusDetailsList
);
router.put(
  "/priest-payment-status/:order_id",
  authenticateAdminToken,
  updatePriestEarningPaymentStatus
);

export default router;
