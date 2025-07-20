import Joi from "joi";

export const getAllOrdersVal = Joi.object({
  cheacker: Joi.boolean().required(),
});
export const confirmOrderVal = Joi.object({
  senderNumber: Joi.string()
    .pattern(/^(?:\+20|0)?1[0125]\d{8}$/)
    .required(),
});
