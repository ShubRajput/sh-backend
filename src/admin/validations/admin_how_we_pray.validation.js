import Joi from "joi";

export const createHowWePrayValidationSchema = Joi.object({
  header_text: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  religion_id: Joi.number().integer().required(),
});
