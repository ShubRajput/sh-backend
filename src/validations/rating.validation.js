import Joi from 'joi';

export const createRatingValidation = Joi.object({
  pooja_booking_id: Joi.number().integer().required(),
  review: Joi.string().min(3).max(100).required(),
  comment: Joi.string().min(3).max(1000).required(),
  rate: Joi.number().min(1).max(5).required(),
});
