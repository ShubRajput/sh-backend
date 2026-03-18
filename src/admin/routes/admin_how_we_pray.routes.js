import express from 'express';

import { createS3Uploader } from '../../middlewares/upload.middleware.js';
import {
  createHowWePray,
  deleteHowWePrayById,
  getAllHowWePray,
  updateHowWePrayById,
} from '../controllers/admin_how_we_pray.controller.js';
import {
  authenticateAdminToken,
} from '../middlewares/admin_auth.middleware.js';

const howWePray = createS3Uploader("uploads/how_we_pray");

const router = express.Router();

router.post(
  "/",
  authenticateAdminToken,
  howWePray.single("prayImage"),
  createHowWePray
);

router.get("/", authenticateAdminToken, getAllHowWePray);
router.delete("/:id", authenticateAdminToken, deleteHowWePrayById);
router.put(
  "/:id",
  authenticateAdminToken,
  howWePray.single("prayImage"),
  updateHowWePrayById
);

export default router;
