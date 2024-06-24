const autoBind = require('auto-bind');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner });
    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);

    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const playlists = await this._service.getPlaylists({ owner });
    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.code(200);

    return response;
  }

  async deletePlaylistHandler(request, h) {
    const { id } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.deletePlaylistById({ id, owner });
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  async postPlaylistSongsHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { id } = request.params;
    const { songId } = request.payload;
    await this._service.postPlaylistSongsById({ id, songId, owner });
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);

    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { id } = request.params;
    const { id: owner } = request.auth.credentials;
    const playlist = await this._service.getPlaylistSongsById({ id, owner });
    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    response.code(200);

    return response;
  }

  async deletePlaylistSongsHandler(request, h) {
    const { id } = request.params;
    const { id: owner } = request.auth.credentials;
    const { songId } = request.payload;
    await this._service.deletePlaylistSongsById({ id, songId, owner });
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
    response.code(201);

    return response;
  }
}

module.exports = PlaylistHandler;
