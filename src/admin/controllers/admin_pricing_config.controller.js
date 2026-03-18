import { BadRequestError } from "../../utils/errors.utils.js";
import {
    createRitualGroupValidation,
    createRitualModeValidation,
    createTempleTypeValidation,
    updateRitualGroupValidation,
    updateRitualModeValidation,
    updateTempleTypeValidation,
} from "../validations/admin_pricing_config.validation.js";
import {
    createRitualGroupService,
    createRitualModeService,
    createTempleTypeService,
    deleteRitualGroupService,
    deleteRitualModeService,
    deleteTempleTypeService,
    getAllRitualGroupsService,
    getAllRitualModesService,
    getAllTempleTypesService,
    getPackagesPreviewService,
    updateRitualGroupService,
    updateRitualModeService,
    updateTempleTypeService,
} from "../services/admin_pricing_config.service.js";

// ==================== TEMPLE TYPES ====================

export const getTempleTypes = async (req, res, next) => {
    try {
        const data = await getAllTempleTypesService();
        return res.status(200).json({ status: 200, data });
    } catch (error) {
        next(error);
    }
};

export const createTempleType = async (req, res, next) => {
    try {
        const { error } = createTempleTypeValidation.validate(req.body);
        if (error) throw new BadRequestError(error.details[0].message);
        const data = await createTempleTypeService(req.body);
        return res.status(201).json({ status: 201, message: "Temple type created successfully", data });
    } catch (error) {
        next(error);
    }
};

export const updateTempleType = async (req, res, next) => {
    try {
        const { error } = updateTempleTypeValidation.validate(req.body);
        if (error) throw new BadRequestError(error.details[0].message);
        const updated = await updateTempleTypeService(req.params.id, req.body);
        if (!updated) throw new BadRequestError("Temple type not found");
        return res.status(200).json({ status: 200, message: "Temple type updated successfully" });
    } catch (error) {
        next(error);
    }
};

export const deleteTempleType = async (req, res, next) => {
    try {
        const deleted = await deleteTempleTypeService(req.params.id);
        if (!deleted) throw new BadRequestError("Temple type not found");
        return res.status(200).json({ status: 200, message: "Temple type deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// ==================== RITUAL MODES ====================

export const getRitualModes = async (req, res, next) => {
    try {
        const data = await getAllRitualModesService();
        return res.status(200).json({ status: 200, data });
    } catch (error) {
        next(error);
    }
};

export const createRitualMode = async (req, res, next) => {
    try {
        const { error } = createRitualModeValidation.validate(req.body);
        if (error) throw new BadRequestError(error.details[0].message);
        const data = await createRitualModeService(req.body);
        return res.status(201).json({ status: 201, message: "Ritual mode created successfully", data });
    } catch (error) {
        next(error);
    }
};

export const updateRitualMode = async (req, res, next) => {
    try {
        const { error } = updateRitualModeValidation.validate(req.body);
        if (error) throw new BadRequestError(error.details[0].message);
        const updated = await updateRitualModeService(req.params.id, req.body);
        if (!updated) throw new BadRequestError("Ritual mode not found");
        return res.status(200).json({ status: 200, message: "Ritual mode updated successfully" });
    } catch (error) {
        next(error);
    }
};

export const deleteRitualMode = async (req, res, next) => {
    try {
        const deleted = await deleteRitualModeService(req.params.id);
        if (!deleted) throw new BadRequestError("Ritual mode not found");
        return res.status(200).json({ status: 200, message: "Ritual mode deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// ==================== RITUAL GROUPS ====================

export const getRitualGroups = async (req, res, next) => {
    try {
        const data = await getAllRitualGroupsService();
        return res.status(200).json({ status: 200, data });
    } catch (error) {
        next(error);
    }
};

export const createRitualGroup = async (req, res, next) => {
    try {
        const { error } = createRitualGroupValidation.validate(req.body);
        if (error) throw new BadRequestError(error.details[0].message);
        const data = await createRitualGroupService(req.body);
        return res.status(201).json({ status: 201, message: "Ritual group created successfully", data });
    } catch (error) {
        next(error);
    }
};

export const updateRitualGroup = async (req, res, next) => {
    try {
        const { error } = updateRitualGroupValidation.validate(req.body);
        if (error) throw new BadRequestError(error.details[0].message);
        const updated = await updateRitualGroupService(req.params.id, req.body);
        if (!updated) throw new BadRequestError("Ritual group not found");
        return res.status(200).json({ status: 200, message: "Ritual group updated successfully" });
    } catch (error) {
        next(error);
    }
};

export const deleteRitualGroup = async (req, res, next) => {
    try {
        const deleted = await deleteRitualGroupService(req.params.id);
        if (!deleted) throw new BadRequestError("Ritual group not found");
        return res.status(200).json({ status: 200, message: "Ritual group deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// ==================== PACKAGES PREVIEW ====================

export const getPackagesPreview = async (req, res, next) => {
    try {
        const data = await getPackagesPreviewService();
        return res.status(200).json({ status: 200, data });
    } catch (error) {
        next(error);
    }
};
