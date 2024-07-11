const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, options) => {
    const exportsHandler = new ExportsHandler(options);
    server.route(routes(exportsHandler));
  },
};
