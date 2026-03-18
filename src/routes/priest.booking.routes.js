import express from 'express';

import { getAllBookings } from '../controllers/pooja_booking.controller.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, authorizeRoles('priest'), getAllBookings);

export default router;
