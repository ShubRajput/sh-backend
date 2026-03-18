import express from "express";

import { getAllBookingsDetails } from "../controllers/admin_booking_pooja.controller.js";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";

const router = express.Router();
router.get("/", authenticateAdminToken, getAllBookingsDetails);

export default router;
