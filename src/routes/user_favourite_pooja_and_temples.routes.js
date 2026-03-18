import express from 'express';

import {
  addPoojaToFavorites,
  addTempleToFavorites,
  getUserFavouritePoojaAndTemples,
  removePoojaFromFavorites,
  removeTempleFromFavorites,
} from '../controllers/user_favourite_pooja_and_temples.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/pooja", authenticateToken, addPoojaToFavorites);
router.get("/", authenticateToken, getUserFavouritePoojaAndTemples);
router.post("/temple", authenticateToken, addTempleToFavorites);
router.delete("/pooja/:pooja_id", authenticateToken, removePoojaFromFavorites);
router.delete(
  "/temple/:temple_id",
  authenticateToken,
  removeTempleFromFavorites
); // Assuming you have a similar function for temples

export default router;
