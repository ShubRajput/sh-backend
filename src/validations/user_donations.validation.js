import Joi from "joi";

export const createUserDonationSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  currency: Joi.string().valid("INR", "USD", "EUR").required(),
  religion_id: Joi.number().integer().min(1).required(),
});

export const verifyDonationPaymentSchema = Joi.object({
  payment_id: Joi.string().required(),
  order_id: Joi.string().required(),
  signature: Joi.string().allow(null),
});
