const Joi = require("joi");

const registerSchema = Joi.object({
    username: Joi.string().min(1).max(60).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(6).max(255).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required()
})

module.exports.registerSchema = registerSchema