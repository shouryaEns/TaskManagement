const Joi = require('joi');

exports.registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .max(20)
      .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
      .message("Password must contain letters and numbers")
      .required(),
    role: Joi.string().valid('user', 'admin')
  });
  return schema.validate(data);
};

exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};
