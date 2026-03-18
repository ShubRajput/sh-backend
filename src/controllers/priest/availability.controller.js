import {
    upsertPriestAvailabilityService,
    getPriestAvailabilityService,
    addPriestUnavailabilityService,
    getPriestUnavailabilityService,
    deletePriestUnavailabilityService,
} from "../../services/priest/availability.service.js";
import { BadRequestError } from "../../utils/errors.utils.js";
import {
    addPriestAvailabilityValidation,
    addPriestUnavailabilityValidation,
    deletePriestUnavailabilityValidation,
} from "../../validations/priest_availability.validation.js";

export const upsertPriestAvailability = async (req, res, next) => {
    try {
        const priestId = req.user.id;
        if (!priestId) {
            throw new BadRequestError(
                "Only a registered priest is allowed to perform this action."
            );
        }

        const { error, value } = addPriestAvailabilityValidation.validate(req.body);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        await upsertPriestAvailabilityService(priestId, value.availability);

        res.status(200).json({
            status: 200,
            message: "Priest availability updated successfully",
        });
    } catch (err) {
        next(err);
    }
};

export const getPriestAvailability = async (req, res, next) => {
    try {
        const priestId = req.user.id;
        if (!priestId) {
            throw new BadRequestError(
                "Only a registered priest is allowed to perform this action."
            );
        }

        const data = await getPriestAvailabilityService(priestId);

        res.status(200).json({
            status: 200,
            message: "Priest availability fetched successfully",
            data,
        });
    } catch (err) {
        next(err);
    }
};

export const addPriestUnavailability = async (req, res, next) => {
    try {
        const priestId = req.user.id;
        if (!priestId) {
            throw new BadRequestError(
                "Only a registered priest is allowed to perform this action."
            );
        }

        const { error, value } = addPriestUnavailabilityValidation.validate(req.body);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        await addPriestUnavailabilityService(priestId, value);

        res.status(200).json({
            status: 200,
            message: "Priest unavailability marked successfully",
        });
    } catch (err) {
        next(err);
    }
};

export const getPriestUnavailability = async (req, res, next) => {
    try {
        const priestId = req.user.id;
        if (!priestId) {
            throw new BadRequestError(
                "Only a registered priest is allowed to perform this action."
            );
        }

        const data = await getPriestUnavailabilityService(priestId);

        res.status(200).json({
            status: 200,
            message: "Priest unavailability fetched successfully",
            data,
        });
    } catch (err) {
        next(err);
    }
};

export const deletePriestUnavailability = async (req, res, next) => {
    try {
        const priestId = req.user.id;
        if (!priestId) {
            throw new BadRequestError(
                "Only a registered priest is allowed to perform this action."
            );
        }

        const { error, value } = deletePriestUnavailabilityValidation.validate({
            id: req.params.id,
        });

        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        await deletePriestUnavailabilityService(priestId, value.id);

        res.status(200).json({
            status: 200,
            message: "Priest unavailability deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};
