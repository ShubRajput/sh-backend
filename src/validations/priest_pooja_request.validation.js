import Joi from 'joi';

export const handlePriestPoojaRequestValidation = Joi.object({
  order_id: Joi.string().min(1).required(),
  status: Joi.string().valid("active", "cancelled").required(),
  live_or_recorded_url: Joi.string().min(2).max(255),
  priest_id: Joi.number().integer(),
});

export const orderIdValidation = Joi.object({
  order_id: Joi.string().min(1).required(),
});

export const cancelPriestPoojaRequestValidation = Joi.object({
  order_id: Joi.string().min(1).required(),
  cancel_reason: Joi.string().min(5).required().messages({
    "any.required": "Cancel reason is required",
    "string.min": "Cancel reason must be at least 5 characters long",
  }),
});
