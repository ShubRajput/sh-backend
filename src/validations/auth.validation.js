import Joi from "joi";

export const userSignUpValidation = Joi.object({
  user_name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
});

export const userSignInValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
});

export const updateUserProfileDetailsValidation = Joi.object({
  user_name: Joi.string().min(3).max(30),
  date_of_birth: Joi.date().optional().allow(null),
  maritial_state: Joi.string()
    .valid("single", "married", "divorced", "widowed")
    .allow(null),
  location: Joi.string().min(3).max(100).optional().allow(null),
  nationality: Joi.string().min(2).max(50).optional().allow(null),
  gotra: Joi.string().min(2).max(50).optional().allow(null),
  phone_number: Joi.string()
    .pattern(/^\+?[1-9]\d{6,14}$/)
    .optional()
    .allow(null),
  temple_location: Joi.string().allow(null),
  temple_id: Joi.number().optional().allow(null),
});

export const updateUserPhoneNumberValidation = Joi.object({
  phone_number: Joi.string()
    .pattern(/^\+?[0-9]\d{6,14}$/)
    .optional()
    .allow(null)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
});

export const addUserBillingAddressValidation = Joi.object({
  address_line1: Joi.string().min(3).max(100).required(),
  address_line2: Joi.string().optional().allow(null),
  city: Joi.string().min(2).max(50).required(),
  state: Joi.string().min(2).max(50).required(),
  postal_code: Joi.string().required(),
  country: Joi.string().min(2).max(50).required(),
  phone_number: Joi.string()
    .pattern(/^\+?[1-9]\d{6,14}$/)
    .optional()
    .allow(null),
});

export const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
  type: Joi.string().valid("user", "priest").required(),
});

export const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
  token: Joi.string().required(),
});

export const changePasswordValidation = Joi.object({
  oldPassword: Joi.string().min(8).max(50).required(),
  newPassword: Joi.string().min(8).max(50).required(),
});

export const refreshTokenValidation = Joi.object({
  refresh_token: Joi.string().required(),
});
