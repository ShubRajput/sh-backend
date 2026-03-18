import Joi from "joi";

export const addPaymentDetailsValidation = Joi.object({
  account_holder_name: Joi.string().min(3).max(50).required(),
  bank_name: Joi.string().min(3).max(50).required(),
  branch_name: Joi.string().min(3).max(50).required(),
  account_number: Joi.string().min(3).max(50).required(),
});

export const updatePaymentDetailsValidation = Joi.object({
  account_holder_name: Joi.string().min(3).max(50).required(),
  bank_name: Joi.string().min(3).max(50).required(),
  branch_name: Joi.string().min(3).max(50).required(),
  account_number: Joi.string().min(3).max(50).required(),
});
