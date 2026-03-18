import express from "express";

import {
  getAllPriests,
  getPriestAcceptedPoojaBookingsByPriestId,
  getPriestCompletedPoojaBookings,
  getPriestRatingDetailsById,
  getPriestsEarningDetails,
} from "../controllers/admin_priest.controller.js";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";

const router = express.Router();

router.get("/", authenticateAdminToken, getAllPriests);
router.get(
  "/:priestId/rating",
  authenticateAdminToken,
  getPriestRatingDetailsById
);
router.get(
  "/:priestId/pooja-bookings",
  authenticateAdminToken,
  getPriestAcceptedPoojaBookingsByPriestId
);
router.get(
  "/earning-details",
  authenticateAdminToken,
  getPriestsEarningDetails
);
router.get(
  "/:priestId/completed-bookings",
  authenticateAdminToken,
  getPriestCompletedPoojaBookings
);

export default router;
