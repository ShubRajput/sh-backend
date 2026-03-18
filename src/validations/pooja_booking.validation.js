import Joi from "joi";

export const createNewPoojaBookingValidation = Joi.object({
  user_id: Joi.number().integer().required(),
  pooja_id: Joi.number().integer().required(),
  temple_id: Joi.number().integer().required(),
  religion_id: Joi.number().integer().required(),
  mode_of_pooja: Joi.string().valid("Live Video", "Pre-Recorded", "In-Person", "On-Site", "live", "recorded", "on_site").required(),
  pooja_name: Joi.string().min(3).max(100).required(),
  pooja_date: Joi.date(),
  pooja_time: Joi.string(),
  duration_in_hours: Joi.number().required(),
  gotra: Joi.string().min(2).max(50).optional().allow(null, ""),
  additional_note: Joi.string().optional().allow(null),
  number_of_devotees: Joi.number().integer().min(0).required(),
  additional_souvernir_details: Joi.array().optional().allow(null),
  priest_id: Joi.number().integer().required().messages({
    "any.required": "Priest id is required",
  }),
});

export const bookingCalculationValidation = Joi.object({
  pooja_id: Joi.number().integer().required(),
  temple_id: Joi.number().integer().required(),
  mode_of_pooja: Joi.string().valid("Live Video", "Pre-Recorded", "In-Person", "On-Site", "live", "recorded", "on_site").optional(),
  number_of_devotees: Joi.number().integer().min(0).optional(),
  additional_souvernir_details: Joi.array().optional().allow(null),
}).unknown(true);

export const verifyPaymentValidation = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().allow(null),
});
