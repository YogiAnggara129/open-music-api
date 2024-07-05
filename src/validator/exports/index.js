const { validateData } = require('../../utils');
const schema = require('./schema');

const ExportnsValidator = {
  validatePostExportPlaylistsPayload: (payload) => validateData(
    payload,
    schema.PostExportPlaylistPayloadSchema,
  ),
};

module.exports = ExportnsValidator;
