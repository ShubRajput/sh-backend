import express from "express";

import { createS3Uploader } from "../../middlewares/upload.middleware.js";
import {
  createAdminOffering,
  deleteAdminOfferingById,
  deleteAdminOfferingImageById,
  getAllAdminOfferings,
  getOfferingsFinancialDetails,
  updateAdminOfferingById,
  uploadAdminOfferingImage,
} from "../controllers/admin_offerings.controller.js";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";

const offeringImageUploader = createS3Uploader("uploads/offerings");
const router = express.Router();

router.post(
  "/",
  authenticateAdminToken,
  offeringImageUploader.fields([
    { name: "profile_offering", maxCount: 1 },
    { name: "description_offering", maxCount: 9 },
  ]),
  createAdminOffering
);
router.get("/", authenticateAdminToken, getAllAdminOfferings);
router.delete("/:id", authenticateAdminToken, deleteAdminOfferingById);
router.put("/:id", authenticateAdminToken, updateAdminOfferingById);
router.delete(
  "/images/:id",
  authenticateAdminToken,
  deleteAdminOfferingImageById
);
router.post(
  "/:id/images",
  authenticateAdminToken,
  offeringImageUploader.fields([
    { name: "profile_offering", maxCount: 1 },
    { name: "description_offering", maxCount: 9 },
  ]),
  uploadAdminOfferingImage
);
router.get("/finance", authenticateAdminToken, getOfferingsFinancialDetails);
export default router;
