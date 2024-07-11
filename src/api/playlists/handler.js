const autoBind = require('auto-bind');
const { PlaylistRole } = require('../../utils');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistHandler {
  constructor({ playlistsService, playlistSongsService, validator }) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({
      name,
      owner,
    });
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
    const { id: userId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists({ userId });
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
    const { id: userId } = request.auth.credentials;
    const role = await this._playlistsService.getRole({ id, userId });
    if (role !== PlaylistRole.owner) {
      throw new AuthorizationError(
        'Kolaborator tidak dapat menghapus playlist',
      );
    } else if (role === null) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }
    await this._playlistsService.deletePlaylistById({ id });
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  async postPlaylistSongsHandler(request, h) {
    this._validator.validatePostPlaylistSongPayload(request.payload);

    const { id: userId } = request.auth.credentials;
    const { id } = request.params;
    const role = await this._playlistsService.getRole({ id, userId });
    if (role !== PlaylistRole.owner && role !== PlaylistRole.collaborator) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }

    const { songId } = request.payload;
    await this._playlistSongsService.postPlaylistSongsById({ id, songId, userId });
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);

    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;
    const playlist = await this._playlistSongsService.getPlaylistSongsById({ id });
    const role = await this._playlistsService.getRole({ id, userId });
    if (role !== PlaylistRole.owner && role !== PlaylistRole.collaborator) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }
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
    const { id: userId } = request.auth.credentials;
    const role = await this._playlistsService.getRole({ id, userId });
    if (role !== PlaylistRole.owner && role !== PlaylistRole.collaborator) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }

    const { songId } = request.payload;
    await this._playlistSongsService.deletePlaylistSongsById({ id, songId, userId });
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
    response.code(200);
    return response;
  }

  async getPlaylistSongActivitiesHandler(request, h) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;
    const role = await this._playlistsService.getRole({ id, userId });
    if (role !== PlaylistRole.owner && role !== PlaylistRole.collaborator) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }

    const activities = await this._playlistSongsService.getPlaylistSongActivitiesById({ id });
    const response = h.response({
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistHandler;
