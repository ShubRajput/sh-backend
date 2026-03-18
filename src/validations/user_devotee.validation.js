import Joi from 'joi';

export const creatUserDevoteeValidation = Joi.object({
  devotee_name: Joi.string().min(3).max(50).required(),
  gender: Joi.string().valid("M", "F").optional(),
  date_of_birth: Joi.date().optional().allow(null),
  gotra: Joi.string().min(2).max(50).optional().allow(null),
});

export const updateUserDevoteeByIdValidation = Joi.object({
  devotee_name: Joi.string().min(3).max(50).required(),
  gender: Joi.string().valid("M", "F").optional(),
  date_of_birth: Joi.date().optional().allow(null),
  gotra: Joi.string().min(2).max(50).optional().allow(null),
});
