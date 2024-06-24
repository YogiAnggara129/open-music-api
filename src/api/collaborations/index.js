const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, options) => {
    const collaborationsHandler = new CollaborationsHandler(options);
    server.route(routes(collaborationsHandler));
  },
};
