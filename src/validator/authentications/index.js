const { validateData } = require('../../utils');
const schema = require('./schema');

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => validateData(
    payload,
    schema.PostAuthenticationPayloadSchema,
  ),
  validatePutAuthenticationPayload: (payload) => validateData(
    payload,
    schema.PutAuthenticationPayloadSchema,
  ),
  validateDeleteAuthenticationPayload: (payload) => validateData(
    payload,
    schema.DeleteAuthenticationPayloadSchema,
  ),
};

module.exports = AuthenticationsValidator;
