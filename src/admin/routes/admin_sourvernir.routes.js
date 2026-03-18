import express from "express";

import { createS3Uploader } from "../../middlewares/upload.middleware.js";
import {
  createSouvernir,
  deleteSouvernirById,
  getAllSouvernirs,
  getSouvernirDetailsByKey,
  updateSouvernirById,
} from "../controllers/admin_souvernir.controller.js";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";

const souvImageUploader = createS3Uploader("uploads/souvernir");

const router = express.Router();

router.post(
  "/",
  authenticateAdminToken,
  souvImageUploader.single("image"),
  createSouvernir
);
router.get("/", authenticateAdminToken, getAllSouvernirs);
router.delete("/:souv_id", authenticateAdminToken, deleteSouvernirById);
router.put(
  "/:souv_id",
  authenticateAdminToken,
  souvImageUploader.single("image"),
  updateSouvernirById
);
router.get(
  "/details/:souv_key",
  authenticateAdminToken,
  getSouvernirDetailsByKey
); // Assuming you have a function to get souv details by key

export default router;
