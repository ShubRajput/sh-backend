import Joi from "joi";

export const priestPaymentStatusChangeValidation = Joi.object({
  paid_status: Joi.string()
    .valid("pending", "completed", "in-progress", "holding")
    .required(),
  payment_method: Joi.string().valid("bank", "upi", "cash").optional(),
  payment_reference: Joi.string().optional(),
  remarks: Joi.string().optional(),
});
