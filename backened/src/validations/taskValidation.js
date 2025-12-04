const Joi = require('joi');

exports.taskValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('todo', 'in-progress', 'done'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    dueDate: Joi.date().optional(),
    assignee: Joi.any().forbidden()
  });

  return schema.validate(data);
};

exports.updateTaskValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('todo', 'in-progress', 'done'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    dueDate: Joi.date().optional(),
    assignee: Joi.any().forbidden()
  });

  return schema.validate(data);
};