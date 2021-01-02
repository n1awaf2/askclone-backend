const Joi = require("joi");
//Register Validation
const registerSchema = Joi.object({
  username: Joi.string().min(1).max(60).required(),
  email: Joi.string().min(5).max(255).email().required(),
  password: Joi.string().min(6).max(255).required(),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
});

//Login Validation
const loginSchema = Joi.object({
  email: Joi.string().max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});
//Forgot Password Request Validation
const forgotPasswordSchema = Joi.object({
  email: Joi.string().max(255).required().email(),
});

//Update PAssword Request Validation
const updatePasswordSchema = Joi.object({
  password: Joi.string().min(6).max(255).required(),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
});

module.exports.registerSchema = registerSchema;
module.exports.loginSchema = loginSchema;
module.exports.forgotPasswordSchema = forgotPasswordSchema;
module.exports.updatePasswordSchema = updatePasswordSchema;