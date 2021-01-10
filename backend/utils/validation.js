// Validation
const Joi = require("@hapi/joi");

// Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
}

// Login Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
// Poll Validation
const pollValidation = (data) => {
  const questionsSchema = Joi.array().length(1).items({
    prompt: Joi.string().required(),
    responses: Joi.array().items(Joi.string()).max(10),
  });

  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    questions: questionsSchema,
    owner: Joi.string(), // TODO: validate objectID
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.pollValidation = pollValidation;
