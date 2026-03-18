import express from "express";

import { getAPIHealth } from "../controllers/system_meta_data.controller.js";

const router = express.Router();

router.get("/health", getAPIHealth);

export default router;
