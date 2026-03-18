import Joi from "joi";

export const updateUserSuspendedStatusValidation = Joi.object({
  userId: Joi.number().integer().required(),
  isSuspended: Joi.boolean().required(),
});
