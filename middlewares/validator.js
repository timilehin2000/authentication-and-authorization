const Joi = require("@hapi/joi");

//cretae the validator for user's input
const signUpValidation = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(30).required().trim(),
    lastname: Joi.string().min(3).max(30).required().trim(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().min(7).max(30).required(),
    role: Joi.string(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().min(7).max(30).required(),
  });
  return schema.validate(data);
};

module.exports = { signUpValidation, loginValidation };
