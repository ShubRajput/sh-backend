import Joi from "joi";

export const createTempleTypeValidation = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    multiplier: Joi.number().min(0.01).max(100).required(),
});

export const updateTempleTypeValidation = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    multiplier: Joi.number().min(0.01).max(100).required(),
});

export const createRitualModeValidation = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    multiplier: Joi.number().min(0.01).max(100).required(),
});

export const updateRitualModeValidation = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    multiplier: Joi.number().min(0.01).max(100).required(),
});

export const createRitualGroupValidation = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    display_name: Joi.string().min(2).max(100).required(),
    multiplier: Joi.number().min(0.01).max(100).required(),
});

export const updateRitualGroupValidation = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    display_name: Joi.string().min(2).max(100).required(),
    multiplier: Joi.number().min(0.01).max(100).required(),
});
