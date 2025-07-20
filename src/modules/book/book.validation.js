import Joi from "joi";

export const addBookVal = Joi.object({
  bookName: Joi.string().min(2).max(30).optional(),
  bookOwner: Joi.string().min(2).max(30).optional(),
  bookPrice: Joi.number().optional(),
  numberOfBooks: Joi.number().optional(),
  gradeOfBooks: Joi.string()
    .valid("الصف الثالث الثانوى", "الصف الثانى الثانوى", "الصف الاول الثانوى")
    .optional(),
  isEmpty: Joi.boolean().optional(),
  weightOfBooks: Joi.number().optional(),
});

export const editBookVal = Joi.object({
  bookName: Joi.string().min(2).max(30).optional(),
  bookOwner: Joi.string().min(2).max(30).optional(),
  bookPrice: Joi.number().optional(),
  numberOfBooks: Joi.number().optional(),
  gradeOfBooks: Joi.string()
    .valid("الصف الثالث الثانوى", "الصف الثانى الثانوى", "الصف الاول الثانوى")
    .optional(),
  isEmpty: Joi.boolean().optional(),
  weightOfBooks: Joi.number().optional(),
});
