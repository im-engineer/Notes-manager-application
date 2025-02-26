const Joi = require('joi');

const createNoteSchema = Joi.object({ 
  title: Joi.string().required(),
  description: Joi.string(),
});

const updateNoteSchema = Joi.object({ 
  title: Joi.string(),
  description: Joi.string(),
  completed: Joi.boolean(),
});

module.exports = {
  createNoteSchema, 
  updateNoteSchema, 
}; 