import { getAvailablePriestsModel } from "../models/pooja_booking_available_priests.model.js";
import { BadRequestError } from "../utils/errors.utils.js";
import { availablePriestsValidation } from "../validations/pooja_booking_available_priests.validation.js";

export const getAvailablePriests = async (req, res, next) => {
    try {
        const { error, value } = availablePriestsValidation.validate(req.query);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        const { temple_id, pooja_id, date, time } = value;

        const availablePriests = await getAvailablePriestsModel(
            temple_id,
            pooja_id,
            date,
            time
        );

        res.status(200).json({
            status: 200,
            message: "Available priests fetched successfully",
            data: availablePriests,
        });
    } catch (err) {
        next(err);
    }
};
