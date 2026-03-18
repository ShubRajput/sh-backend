import Joi from "joi";

export const adminSignUpValidation = Joi.object({
  user_name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
});

export const adminSignInValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
});

export const adminChangePasswordValidation = Joi.object({
  currentPassword: Joi.string().min(8).max(50).required(),
  newPassword: Joi.string().min(8).max(50).required(),
  confirmPassword: Joi.string()
    .min(8)
    .max(50)
    .required()
    .valid(Joi.ref("newPassword")),
});

export const refreshAdminTokenValidation = Joi.object({
  refresh_token: Joi.string().required(),
});
