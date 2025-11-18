const Joi = require('joi');

const progressValues = ['not-started', 'in-progress', 'completed'];

const createTaskSchema = Joi.object({
  title: Joi.string().max(120).trim().required(),
  description: Joi.string().max(1000).allow('', null).default(''),
  dueDate: Joi.date()
    .iso()
    .messages({
      'date.format': 'Due date must be a valid ISO date string',
    })
    .required(),
  progress: Joi.string()
    .valid(...progressValues)
    .default('not-started'),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().max(120).trim(),
  description: Joi.string().max(1000).allow('', null),
  dueDate: Joi.date().iso().messages({
    'date.format': 'Due date must be a valid ISO date string',
  }),
  progress: Joi.string().valid(...progressValues),
}).min(1);

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};

