const { validateData } = require('../../utils');
const schema = require('./schema');

const CollaborationsValidator = {
  validatePostCollaborationPayload: (payload) => validateData(
    payload,
    schema.PostCollaborationPayloadSchema,
  ),
  validateDeleteCollaborationPayload: (payload) => validateData(
    payload,
    schema.DeleteCollaborationPayloadSchema,
  ),
};

module.exports = CollaborationsValidator;
