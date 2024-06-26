const { validateData } = require('../../utils');
const schema = require('./schema');

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => validateData(
    payload,
    schema.PostPlaylistPayloadSchema,
  ),
  validatePostPlaylistSongPayload: (payload) => validateData(
    payload,
    schema.PostPlaylistSongPayloadSchema,
  ),
};

module.exports = PlaylistsValidator;
