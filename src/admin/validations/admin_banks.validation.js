import Joi from 'joi';

export const createBankSchema = Joi.object({
  bank_name: Joi.string().max(100).required(),
  bank_code: Joi.string().max(50).required(),
});
