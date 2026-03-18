import express from "express";

import {
  createUserDonation,
  verifyUserDonationPayment,
} from "../controllers/user_donations.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, createUserDonation);
router.post("/verify-payment", authenticateToken, verifyUserDonationPayment);

export default router;
