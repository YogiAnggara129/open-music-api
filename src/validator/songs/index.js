const InvariantError = require('../../exceptions/InvariantError');
const { SongsPayloadSchema, SongsQuerySchema } = require('./schema');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongQuery: (payload) => {
    const validationResult = SongsQuerySchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
