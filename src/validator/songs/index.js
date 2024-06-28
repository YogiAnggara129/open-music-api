const { validateData } = require('../../utils');
const schema = require('./schema');

const SongsValidator = {
  validateSongPayload: (payload) => validateData(
    payload,
    schema.SongsPayloadSchema,
  ),
  validateSongQuery: (payload) => validateData(
    payload,
    schema.SongsQuerySchema,
  ),
};

module.exports = SongsValidator;
