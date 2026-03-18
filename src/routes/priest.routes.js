import express from "express";

import {
  addPriestIntroduction,
  createPriest,
  getPriestDetails,
  updatePriestProfileDetails,
  uploadPriestProfilePicture,
} from "../controllers/priest.controller.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import { createS3Uploader } from "../middlewares/upload.middleware.js";

const router = express.Router();

const uploadProfileImage = createS3Uploader("uploads/profile_images");

router.post("/become-priest", authenticateToken, createPriest);
router.post(
  "/introduction",
  authenticateToken,
  authorizeRoles("priest"),
  addPriestIntroduction
);
router.post(
  "/upload-profile-picture",
  authenticateToken,
  uploadProfileImage.single("profilePicture"),
  uploadPriestProfilePicture
);
router.get("/details", authenticateToken, getPriestDetails);
router.put("/details", authenticateToken, updatePriestProfileDetails);

export default router;
