const Joi = require('joi');

const currentYear = new Date().getFullYear();

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(currentYear)
    .required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

const SongsQuerySchema = Joi.object({
  title: Joi.string(),
  performer: Joi.string(),
});

module.exports = { SongsPayloadSchema, SongsQuerySchema };
