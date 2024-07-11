const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor({ service }) {
    this._service = service;
    autoBind(this);
  }

  async postLikeHandler(request, h) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._service.addLike({ albumId: id, userId });
    const response = h.response({
      status: 'success',
      message: 'Like berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getLikeCountHandler(request, h) {
    const { id } = request.params;
    const { cache, likes } = await this._service.getLikeCountByAlbumId({ albumId: id });
    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.code(200);
    if (cache) {
      response.header('X-Data-Source', 'cache');
    }
    return response;
  }

  async deleteLikeHandler(request, h) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._service.deleteLike({ albumId: id, userId });
    const response = h.response({
      status: 'success',
      message: 'Like berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = AlbumLikesHandler;
