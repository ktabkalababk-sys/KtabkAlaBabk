import Joi from "joi";

export const addCartVal = Joi.object({
  book: Joi.string().length(24).hex().required(),
  quantity: Joi.number().integer().min(1).required(),
});
export const updateQuantityVal = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});
