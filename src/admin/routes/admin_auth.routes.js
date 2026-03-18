import express from "express";

import {
  adminChangePassword,
  adminSignIn,
  adminSignOut,
  adminSignUp,
  refreshAdminAccessToken,
} from "../controllers/admin_auth.controller.js";
import {
  resendOTP,
  resetPassword,
  sendOTP,
  verifyOTP,
} from "../controllers/admin_reset_password.controller.js";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";

const router = express.Router();

router.post("/sign-up", adminSignUp);
router.post("/sign-in", adminSignIn);
router.post("/change-password", authenticateAdminToken, adminChangePassword);
router.post("/forgot-password/send-otp", sendOTP);
router.post("/forgot-password/verify-otp", verifyOTP);
router.post("/forgot-password/reset-password", resetPassword);
router.post("/forgot-password/resend-otp", resendOTP);
router.post("/refresh-token", refreshAdminAccessToken);
router.post("/sign-out", authenticateAdminToken, adminSignOut);

export default router;
