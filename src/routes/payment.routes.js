import express from "express";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { addPaymentDetails, getAllPaymentDetails, updatePaymentDetails } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/payment-details", authenticateToken, authorizeRoles("priest"), addPaymentDetails);
router.put("/payment-details", authenticateToken, authorizeRoles("priest"), updatePaymentDetails);
router.get("/payment-details", authenticateToken, authorizeRoles("priest"), getAllPaymentDetails);

export default router;
