import Joi from "joi";

export const createNewReligionValidation = Joi.object({
  religion_key: Joi.string().min(3).max(100).required(),
  religion_name: Joi.string().min(3).max(100).required(),
  // religion_description: Joi.string().min(3).max(9999).required(),
  // hover_description: Joi.string().min(3).max(9999).required(),
  sanctuary_name: Joi.string().min(3).max(250).required(),
  feature_name: Joi.string().min(3).max(250).required(),
});

export const updateReligionValidation = Joi.object({
  religion_name: Joi.string().min(3).max(100).required(),
  religion_description: Joi.string().min(3).max(5000).required(),
  hover_description: Joi.string().min(3).max(5000).required(),
  sanctuary_name: Joi.string().min(3).max(250).required(),
  feature_name: Joi.string().min(3).max(250).required(),
});
