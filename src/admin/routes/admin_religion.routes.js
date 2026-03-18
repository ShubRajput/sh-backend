import express from "express";

import { createS3Uploader } from "../../middlewares/upload.middleware.js";
import {
  createNewReligion,
  deleteReligionByKey,
  deleteReligionImageById,
  getAllReligions,
  getReligionByKey,
  updateReligionByKey,
  uploadReligionImage,
} from "../controllers/admin_religion.controller.js";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";

const religionsImageUploader = createS3Uploader("uploads/religions");

const router = express.Router();

router.post(
  "/",
  authenticateAdminToken,
  // religionsImageUploader.fields([
  //   { name: "hover_image", maxCount: 1 },
  //   { name: "description_images", maxCount: 9 },
  // ]),
  createNewReligion
);
router.get("/", authenticateAdminToken, getAllReligions);
router.get("/:key", authenticateAdminToken, getReligionByKey);
router.delete("/:key", authenticateAdminToken, deleteReligionByKey);
router.put(
  "/:key",
  authenticateAdminToken,
  religionsImageUploader.fields([
    { name: "hover_image", maxCount: 1 },
    { name: "description_images", maxCount: 9 },
  ]),
  updateReligionByKey
);
router.delete("/images/:id", authenticateAdminToken, deleteReligionImageById);
router.post(
  "/images/:key",
  authenticateAdminToken,
  religionsImageUploader.fields([
    { name: "hover_image", maxCount: 1 },
    { name: "description_images", maxCount: 9 },
  ]),
  uploadReligionImage
);

export default router;
