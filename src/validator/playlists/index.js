const { validateData } = require('../../utils');
const schema = require('./schema');

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => validateData(
    payload,
    schema.PostPlaylistPayloadSchema,
  ),
  validatePostPlaylistSongsPayload: (payload) => validateData(
    payload,
    schema.PostPlaylistSongsPayloadSchema,
  ),
};

module.exports = PlaylistsValidator;
