import Joi from "joi";

export const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().required().label("Email"),
    password: Joi.string().min(6).required().label("password"),
  });
  return schema.validate(data);
};
// validate the updated user details
export const validateUpdate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().label("First Name"),
    lastName: Joi.string().label("Last Name"),
    email: Joi.string().label("Email"),
    password: Joi.string().min(6).label("password"),
  });
  return schema.validate(data);
};
// validate reset password
export const validateResetPassword = (data) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    new_password: Joi.string().min(6).required().label("New Password"),
    confirm_password: Joi.string().min(6).required().label("Confirm Password"),
  });
  return schema.validate(data);
};
