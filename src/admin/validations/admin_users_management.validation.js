import Joi from "joi";

export const approveAdminValidation = Joi.object({
  admin_id: Joi.number().integer().min(1).required(),
  is_approved: Joi.boolean().required(),
});
