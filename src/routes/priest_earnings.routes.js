import express from 'express';
import { 
    authenticateToken, 
    authorizeRoles 
} from '../middlewares/auth.middleware.js';
import {
    getAllEarnings,
    getMonthEarnings,
    getTodayEarnings,
    getYearEarnings
} from '../controllers/priest_earning.controller.js';

const router = express.Router();

router.get(
    "/today-earnings", 
    authenticateToken, 
    authorizeRoles('priest'), 
    getTodayEarnings
);
router.get(
    "/monthly-earnings", 
    authenticateToken, 
    authorizeRoles('priest'), 
    getMonthEarnings
);
router.get(
    "/yearly-earnings", 
    authenticateToken, 
    authorizeRoles('priest'), 
    getYearEarnings
);
router.get(
    "/all-earnings", 
    authenticateToken, 
    authorizeRoles('priest'), 
    getAllEarnings
);

export default router;