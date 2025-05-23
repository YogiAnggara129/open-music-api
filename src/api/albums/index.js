const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, options) => {
    const albumsHandler = new AlbumsHandler(options);
    server.route(routes(albumsHandler));
  },
};
