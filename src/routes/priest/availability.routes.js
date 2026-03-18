import express from "express";
import {
    upsertPriestAvailability,
    getPriestAvailability,
    addPriestUnavailability,
    getPriestUnavailability,
    deletePriestUnavailability,
} from "../../controllers/priest/availability.controller.js";
import { authenticateToken, authorizeRoles } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/availability",
    authenticateToken,
    authorizeRoles("priest"),
    upsertPriestAvailability
);
router.get(
    "/availability",
    authenticateToken,
    authorizeRoles("priest"),
    getPriestAvailability
);
router.post(
    "/unavailability",
    authenticateToken,
    authorizeRoles("priest"),
    addPriestUnavailability
);
router.get(
    "/unavailability",
    authenticateToken,
    authorizeRoles("priest"),
    getPriestUnavailability
);
router.delete(
    "/unavailability/:id",
    authenticateToken,
    authorizeRoles("priest"),
    deletePriestUnavailability
);

export default router;
