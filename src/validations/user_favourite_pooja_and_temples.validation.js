import Joi from 'joi';

export const addUserFavouritePoojaValidation = Joi.object({
  pooja_id: Joi.number().integer().required(),
});

export const addUserFavouriteTempleValidation = Joi.object({
  temple_id: Joi.number().integer().required(),
});

export const removeUserFavouritePoojaValidation = Joi.object({
  pooja_id: Joi.number().integer().required(),
});

export const removeUserFavouriteTempleValidation = Joi.object({
  temple_id: Joi.number().integer().required(),
});
