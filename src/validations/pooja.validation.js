import Joi from 'joi';

export const createPoojaValidation = Joi.object({
  pooja_key: Joi.string().min(3).max(50).required(),
  pooja_name: Joi.string().min(3).max(100).required(),
  pooja_description: Joi.string().min(10).max(500).required(),
  duration_in_hours: Joi.number().required(),
  price: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
});

export const updatePoojaValidation = Joi.object({
  pooja_key: Joi.string().min(3).max(50).required(),
  pooja_name: Joi.string().min(3).max(100).required(),
  pooja_description: Joi.string().min(10).max(500).required(),
  duration_in_hours: Joi.number().required(),
  price: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
});
