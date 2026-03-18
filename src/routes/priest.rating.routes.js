import express from 'express';

import { getAllRatings } from '../controllers/rating.controller.js';
import {
  authenticateToken,
  authorizeRoles,
} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, authorizeRoles('priest'), getAllRatings);

export default router;
