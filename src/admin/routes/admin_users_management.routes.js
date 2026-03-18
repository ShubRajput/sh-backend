import express from "express";

import {
  approveAdmin,
  getAllUsers,
  getPendingAdmins,
  updateUserSuspendedStatus,
} from "../controllers/admin_users_management.controller.js";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";

const router = express.Router();

router.get("/users", authenticateAdminToken, getAllUsers);
router.post(
  "/users/suspend",
  authenticateAdminToken,
  updateUserSuspendedStatus
);
router.get("/pending-admins", authenticateAdminToken, getPendingAdmins);
router.post("/admin-approve-status", authenticateAdminToken, approveAdmin);

export default router;
