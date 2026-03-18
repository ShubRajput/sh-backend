import Joi from 'joi';

export const submitUserOfferingValidation = Joi.object({
  offering_items: Joi.array()
    .items(
      Joi.object({
        offering_id: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
  temple_id: Joi.number().integer().required(),
  currency: Joi.string().valid("INR", "USD", "EUR").required(),
  religion_id: Joi.number().integer().required(),
});

export const verifyUserOfferingPaymentSchema = Joi.object({
  payment_id: Joi.string().required(),
  order_id: Joi.string().required(),
  signature: Joi.string().allow(null),
});
