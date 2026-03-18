import Joi from "joi";

export const createAdminDonationValidationSchema = Joi.object({
  donation_key: Joi.string().required(),
  donation_name: Joi.string().required(),
  donation_description: Joi.string().required(),
  religion_id: Joi.number().integer().required(),
});

export const updateAdminDonationValidationSchema = Joi.object({
  donation_name: Joi.string().required(),
  donation_description: Joi.string().required(),
});
