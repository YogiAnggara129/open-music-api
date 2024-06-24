const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, options) => {
    const authenticationsHandler = new AuthenticationsHandler(options);
    server.route(routes(authenticationsHandler));
  },
};
