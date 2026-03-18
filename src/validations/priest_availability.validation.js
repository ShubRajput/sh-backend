import Joi from "joi";

export const addPriestAvailabilityValidation = Joi.object({
    availability: Joi.array().items(
        Joi.object({
            temple_id: Joi.number().required().messages({
                "any.required": "Temple id is required",
                "number.base": "Temple id should be a number",
            }),
            day_of_week: Joi.string()
                .valid(
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                )
                .required()
                .messages({
                    "any.required": "Day of week is required",
                    "any.only": "Invalid day of week",
                }),
            timings: Joi.array().items(
                Joi.object({
                    from: Joi.string()
                        .pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/)
                        .required()
                        .messages({
                            "any.required": "From time is required",
                            "string.pattern.base": "From time must be in HH:MM format",
                        }),
                    to: Joi.string()
                        .pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/)
                        .required()
                        .messages({
                            "any.required": "To time is required",
                            "string.pattern.base": "To time must be in HH:MM format",
                        }),
                })
            ).min(1).required().messages({
                "any.required": "Timings array is required",
                "array.min": "At least one timing entry is required",
            })
        })
    ).min(1).required().messages({
        "any.required": "Availability array is required",
        "array.min": "At least one availability entry is required",
    }),
});

export const addPriestUnavailabilityValidation = Joi.object({
    start_date: Joi.date().iso().required().messages({
        "any.required": "Start date is required",
        "date.format": "Start date must be a valid ISO date (YYYY-MM-DD)",
    }),
    end_date: Joi.date().iso().min(Joi.ref("start_date")).required().messages({
        "any.required": "End date is required",
        "date.format": "End date must be a valid ISO date",
        "date.min": "End date must be greater than or equal to start date",
    }),
    reason: Joi.string().allow("").optional(),
});

export const deletePriestUnavailabilityValidation = Joi.object({
    id: Joi.number().required().messages({
        "any.required": "Unavailability ID is required",
        "number.base": "Unavailability ID must be a number",
    }),
});
