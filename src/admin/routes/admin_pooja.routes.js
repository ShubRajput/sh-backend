import express from "express";

import {
  createNewPooja,
  deletePoojaById,
  getAllPoojas,
  getPoojaByKey,
  updatePoojaById,
} from "../../admin/controllers/admin_pooja.controller.js";
import { createS3Uploader } from "../../middlewares/upload.middleware.js";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";

const poojaUploader = createS3Uploader("uploads/pooja");
const router = express.Router();

router.post(
  "/",
  authenticateAdminToken,
  poojaUploader.single("image"),
  createNewPooja
);
router.get("/", authenticateAdminToken, getAllPoojas);
router.delete("/:id", authenticateAdminToken, deletePoojaById);
router.put(
  "/:id",
  authenticateAdminToken,
  poojaUploader.single("image"),
  updatePoojaById
);
router.get("/details/:pooja_key", authenticateAdminToken, getPoojaByKey);

export default router;
