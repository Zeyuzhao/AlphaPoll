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
  });
  return schema.validate(data);
};

const responseValidation = (data, poll) => {
  const questions = poll.questions;

  // TODO: change to custom validation?
  const schema = Joi.object({
    owner: Joi.string(), // optional
    answers: Joi.array().ordered(...questions.map( // Every answer must be an option of its corresponding question
      x => Joi.any().valid(...x.responses).required(),
    )).required(),
  });
  return schema.validate(data);
}

module.exports = {
  registerValidation, 
  loginValidation, 
  pollValidation, 
  responseValidation
};