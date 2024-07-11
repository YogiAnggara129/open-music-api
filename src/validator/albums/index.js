const { validateData } = require('../../utils');
const schema = require('./schema');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => validateData(
    payload,
    schema.AlbumPayloadSchema,
  ),
  validateAlbumCoverHeader: (headers) => validateData(
    headers,
    schema.AlbumCoverHeaderSchema,
  ),
};

module.exports = AlbumsValidator;
