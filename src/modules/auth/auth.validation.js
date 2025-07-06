import joi from "joi";

export const signupval = joi.object({
  firstName: joi.string().min(2).max(30).required(),
  lastName: joi.string().min(2).max(30).required(),
  password: joi
    .string()
    .pattern(/^[a-zA-Z0-9!@#$%^&*]{8,20}$/)
    .required(),
  phoneNumber: joi
    .string()
    .pattern(/^(?:\+20|0)?1[0125]\d{8}$/)
    .required(),
  repassword: joi.valid(joi.ref("password")),
});

export const signinval = joi.object({
  phoneNumber: joi
    .string()
    .pattern(/^(?:\+20|0)?1[0125]\d{8}$/)
    .required(),
  password: joi
    .string()
    .pattern(/^[a-zA-Z0-9!@#$%^&*]{8,20}$/)
    .required(),
});
