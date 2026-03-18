import Joi from "joi";

export const createSouvernirValidation = Joi.object({
  souv_key: Joi.string().min(3).max(50).required(),
  souv_name: Joi.string().min(3).max(100).required(),
  souv_description: Joi.string().min(10).max(5000),
  price: Joi.number().positive().required(),
  currency: Joi.string().valid("INR", "USD", "EUR").required(),
  religion_id: Joi.number().integer().required(),
});

export const updateSouvernirValidation = Joi.object({
  souv_key: Joi.string().min(3).max(50).required(),
  souv_name: Joi.string().min(3).max(100).required(),
  souv_description: Joi.string().min(10).max(5000),
  price: Joi.number().positive().required(),
  currency: Joi.string().valid("INR", "USD", "EUR").required(),
});
