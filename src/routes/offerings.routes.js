import express from "express";

import {
  getAllOfferings,
  getOfferingsById,
  submitUserOffering,
  verifyUserOfferingPayment,
} from "../controllers/offerings.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllOfferings);
router.get("/:offeringId", getOfferingsById);
router.post("/", authenticateToken, submitUserOffering);
router.post("/verify-payment", authenticateToken, verifyUserOfferingPayment);

export default router;
