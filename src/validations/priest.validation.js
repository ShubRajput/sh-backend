import Joi from "joi";

export const createPriestValidation = Joi.object({
  phone_number: Joi.string()
    .pattern(/^\+?[1-9]\d{6,14}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid international format.",
      "string.empty": "Phone number is required.",
    }),
  religion: Joi.string().required(),
  religion_id: Joi.number().integer().required(),
  temple_id: Joi.number().integer().allow(null).optional(),
});

export const addpriestIntroductionValidation = Joi.object({
  introduction: Joi.string().min(2).max(255).required(),
});

export const updatePriestProfileDetailsValidation = Joi.object({
  user_name: Joi.string().min(3).max(30),
  date_of_birth: Joi.date().optional().allow(null),
  temple_id: Joi.number().integer().optional().allow(null),
  nationality: Joi.string().min(2).max(50).optional().allow(null),
  religion: Joi.string().min(2).max(50),
  introduction: Joi.string().min(2).max(255).optional().allow(null),
  religion_id: Joi.number().integer().required(),
});
