import Joi from "joi";

export const availablePriestsValidation = Joi.object({
    temple_id: Joi.number().required().messages({
        "any.required": "Temple id is required",
        "number.base": "Temple id should be a number",
    }),
    pooja_id: Joi.number().required().messages({
        "any.required": "Pooja id is required",
        "number.base": "Pooja id should be a number",
    }),
    date: Joi.date().iso().required().messages({
        "any.required": "Date is required",
        "date.format": "Date must be a valid ISO date",
    }),
    time: Joi.string()
        .pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/)
        .required()
        .messages({
            "any.required": "Time is required",
            "string.pattern.base": "Time must be in HH:MM format",
        }),
});
