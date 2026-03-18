import Joi from 'joi';

export const createNewAdminOfferingValidationSchema = Joi.object({
  offering_key: Joi.string().min(3).max(50).required(),
  offering_name: Joi.string().min(3).max(100).required(),
  offering_description: Joi.string().min(10).max(5000).required(),
  price: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  religion_id: Joi.number().integer().min(1).required(),
});

export const updateAdminOfferingValidationSchema = Joi.object({
  offering_name: Joi.string().min(3).max(100).required(),
  offering_description: Joi.string().min(10).max(5000).required(),
  price: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
});
