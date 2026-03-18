import express from "express";

import {
  addUserBillingAddress,
  changePassword,
  checkIsPriest,
  createVolunteer,
  forgotPassword,
  getUserBillingAddress,
  getUserDetails,
  refreshAccessToken,
  resetPassword,
  updateUserPhoneNumber,
  updateUserProfileDetails,
  uploadUserProfilePicture,
  userSignIn,
  userSignUp,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { createS3Uploader } from "../middlewares/upload.middleware.js";

const router = express.Router();

const uploadProfileImage = createS3Uploader("uploads/profile_images");

router.post("/sign-up", userSignUp);
router.post("/sign-in", userSignIn);
router.put("/user/details", authenticateToken, updateUserProfileDetails);
router.get("/user", authenticateToken, getUserDetails);
router.put("/user/phone-number", authenticateToken, updateUserPhoneNumber);
router.post("/user/billing-address", authenticateToken, addUserBillingAddress);
router.get("/user/billing-address", authenticateToken, getUserBillingAddress);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/user/is-priest", authenticateToken, checkIsPriest);
router.post("/become-volunteer", authenticateToken, createVolunteer);
router.post(
  "/upload-profile-picture",
  authenticateToken,
  uploadProfileImage.single("profilePicture"),
  uploadUserProfilePicture
);
router.post("/user/change-password", authenticateToken, changePassword);
router.post("/refresh-token", refreshAccessToken);
router.get("/verify-email", verifyEmail);

export default router;
