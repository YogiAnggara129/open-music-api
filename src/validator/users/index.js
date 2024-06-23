const { validateData } = require('../../utils');
const { UserPayloadSchema } = require('./schema');

const UsersValidator = {
  validateUserPayload: (payload) => validateData(payload, UserPayloadSchema),
};

module.exports = UsersValidator;
