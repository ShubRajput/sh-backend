import express from "express";

import {
  createBank,
  deleteBankById,
  getAllBanks,
} from "../controllers/admin_banks.controller.js";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";

const router = express.Router();
router.post("/", authenticateAdminToken, createBank);
router.get("/", authenticateAdminToken, getAllBanks);
router.delete("/:id", authenticateAdminToken, deleteBankById);

export default router;
