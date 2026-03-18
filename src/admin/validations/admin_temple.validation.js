import Joi from "joi";

export const createNewTempleValidation = Joi.object({
  religion_id: Joi.number().integer().min(1).required(),
  temple_key: Joi.string().min(3).max(50).required(),
  temple_name: Joi.string().min(3).max(100).required(),
  temple_description: Joi.string().min(2).max(5000).required(),
  location: Joi.string().min(3).max(100).required(),
  tagline: Joi.string().min(3).max(255).required(),
  temple_type_id: Joi.alternatives().try(Joi.number().integer().min(1), Joi.string().valid('', 'null')).allow(null).optional(),
});

export const updateTempleValidation = Joi.object({
  temple_key: Joi.string().min(3).max(50).optional(),
  temple_name: Joi.string().min(3).max(100).optional(),
  temple_description: Joi.string().min(2).max(5000).optional(),
  location: Joi.string().min(3).max(100).optional(),
  tagline: Joi.string().min(3).max(255).optional(),
  temple_type_id: Joi.alternatives().try(Joi.number().integer().min(1), Joi.string().valid('', 'null')).allow(null).optional(),
  religion_id: Joi.number().integer().min(1).optional(),
});
