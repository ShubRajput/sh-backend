import express from "express";

import {
  createUserDevotee,
  deleteUserDevoteeById,
  getUserAllDevoteesByUserId,
  updateUserDevoteeById,
} from "../controllers/user_devotee.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, createUserDevotee);
router.get("/", authenticateToken, getUserAllDevoteesByUserId);
router.delete("/:id", authenticateToken, deleteUserDevoteeById);
router.put("/:id", authenticateToken, updateUserDevoteeById);

export default router;
