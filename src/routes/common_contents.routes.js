import express from 'express';

import {
  getAllBanks,
  getAllTemples,
  getDonationsList,
  getHowWePrayList,
  getOfferingsList,
  getPoojaList,
  getReligionDetailsById,
  getReligionList,
  getSouvernirsList,
} from '../controllers/common_contents.controller.js';

const router = express.Router();

router.get("/religions", getReligionList);
router.get("/religions/:id", getReligionDetailsById);
router.get("/temples", getAllTemples);
router.get("/how-we-pray", getHowWePrayList);
router.get("/souvernirs", getSouvernirsList);
router.get("/poojas", getPoojaList);
router.get("/offerings", getOfferingsList);
router.get("/donations", getDonationsList);
router.get("/banks", getAllBanks);

export default router;
