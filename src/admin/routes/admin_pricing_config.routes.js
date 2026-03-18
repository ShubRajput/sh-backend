import express from "express";
import { authenticateAdminToken } from "../middlewares/admin_auth.middleware.js";
import {
    // Temple types
    getTempleTypes,
    createTempleType,
    updateTempleType,
    deleteTempleType,
    // Ritual modes
    getRitualModes,
    createRitualMode,
    updateRitualMode,
    deleteRitualMode,
    // Ritual groups
    getRitualGroups,
    createRitualGroup,
    updateRitualGroup,
    deleteRitualGroup,
    // Preview
    getPackagesPreview,
} from "../controllers/admin_pricing_config.controller.js";

const router = express.Router();

// Temple types
router.get("/temple-types", authenticateAdminToken, getTempleTypes);
router.post("/temple-types", authenticateAdminToken, createTempleType);
router.put("/temple-types/:id", authenticateAdminToken, updateTempleType);
router.delete("/temple-types/:id", authenticateAdminToken, deleteTempleType);

// Ritual modes
router.get("/ritual-modes", authenticateAdminToken, getRitualModes);
router.post("/ritual-modes", authenticateAdminToken, createRitualMode);
router.put("/ritual-modes/:id", authenticateAdminToken, updateRitualMode);
router.delete("/ritual-modes/:id", authenticateAdminToken, deleteRitualMode);

// Ritual groups
router.get("/ritual-groups", authenticateAdminToken, getRitualGroups);
router.post("/ritual-groups", authenticateAdminToken, createRitualGroup);
router.put("/ritual-groups/:id", authenticateAdminToken, updateRitualGroup);
router.delete("/ritual-groups/:id", authenticateAdminToken, deleteRitualGroup);

// Package preview
router.get("/packages/preview", authenticateAdminToken, getPackagesPreview);

export default router;
