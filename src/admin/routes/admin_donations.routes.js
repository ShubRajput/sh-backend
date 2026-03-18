import express from "express";

import { createS3Uploader } from "../../middlewares/upload.middleware.js";
import {
  createAdminDonationContent,
  deleteAdminDonationContentById,
  getAllAdminDonationContents,
  getAllUsersDonations,
  updateAdminDonationContentById,
} from "../controllers/admin_donations.controller.js";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";

const donationUploader = createS3Uploader("uploads/donations");

const router = express.Router();

router.get("/finance", authenticateAdminToken, getAllUsersDonations);
router.post(
  "/",
  authenticateAdminToken,
  donationUploader.single("image"),
  createAdminDonationContent
);
router.get("/", authenticateAdminToken, getAllAdminDonationContents);
router.delete(
  "/:donation_id",
  authenticateAdminToken,
  deleteAdminDonationContentById
);
router.put(
  "/:donation_id",
  authenticateAdminToken,
  donationUploader.single("image"),
  updateAdminDonationContentById
);
export default router;
