import express from 'express';

import { createNewRating } from '../controllers/rating.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/", authenticateToken, createNewRating);

export default router;
