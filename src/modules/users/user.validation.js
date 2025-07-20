import Joi from "joi";

export const userVal = Joi.object({
  firstName: Joi.string().min(2).max(30).optional(),
  lastName: Joi.string().min(2).max(30).optional(),
  phoneNumber: Joi.string()
    .pattern(/^(?:\+20|0)?1[0125]\d{8}$/)
    .optional(),
  address: Joi.string().min(2).max(30).optional(),
  city: Joi.string().min(2).max(30).optional(),
});
