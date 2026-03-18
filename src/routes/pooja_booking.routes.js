import express from "express";

import {
  cancelPoojaBooking,
  createNewPoojaBooking,
  getBookingCalculationDetails,
  getCancelledPoojaBookings,
  getPreviousPoojaBookings,
  getUpcomingPoojaBookings,
  verifyPayment,
  requestRefundPoojaBooking,
  reassignPriestPoojaBooking
} from "../controllers/pooja_booking.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { getAvailablePriests } from "../controllers/pooja_booking_available_priests.controller.js";

const router = express.Router();

router.get("/available-priests", getAvailablePriests);
router.post("/", authenticateToken, createNewPoojaBooking);
router.post("/calculate", getBookingCalculationDetails);
router.get("/cancelled", authenticateToken, getCancelledPoojaBookings);
router.get("/upcoming", authenticateToken, getUpcomingPoojaBookings);
router.get("/previous", authenticateToken, getPreviousPoojaBookings);
router.post("/cancel/:bookingId", authenticateToken, cancelPoojaBooking);
router.post("/verify-payment", authenticateToken, verifyPayment);
router.post("/request-refund", authenticateToken, requestRefundPoojaBooking);
router.put("/reassign-priest", authenticateToken, reassignPriestPoojaBooking);

export default router;
