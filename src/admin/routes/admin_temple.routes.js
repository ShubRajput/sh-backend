import express from "express";

import { createS3Uploader } from "../../middlewares/upload.middleware.js";
import {
  createNewTemple,
  deleteTempleById,
  getTempleDetailsByKey,
  getTemplesDetails,
  updateTempleById,
} from "../controllers/admin_temple.controller.js";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";

const templeImageUploader = createS3Uploader("uploads/temples");

const router = express.Router();

router.post(
  "/",
  authenticateAdminToken,
  templeImageUploader.single("image"),
  createNewTemple
);
router.get("/", authenticateAdminToken, getTemplesDetails);
router.delete("/:id", authenticateAdminToken, deleteTempleById); // Assuming you have a delete function in the controller
router.get(
  "/details/:temple_key",
  authenticateAdminToken,
  getTempleDetailsByKey
); // Assuming you have a function to get temple details by key
router.put(
  "/:id",
  authenticateAdminToken,
  templeImageUploader.single("image"),
  updateTempleById
);

export default router;
