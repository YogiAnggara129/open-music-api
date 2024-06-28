const { validateData } = require('../../utils');
const schema = require('./schema');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => validateData(
    payload,
    schema.AlbumPayloadSchema,
  ),
};

module.exports = AlbumsValidator;
