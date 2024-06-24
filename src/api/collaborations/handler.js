const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor({ collaborationsService, playlistsService, validator }) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validatePostCollaborationPayload(request.payload);

    const { playlistId, userId } = request.payload;
    const { id: owner } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAvailableById({ id: playlistId, owner });
    await this._collaborationsService.addCollaboration({ playlistId, userId });

    const response = h.response({
      status: 'success',
      message: 'Kolaborator playlist berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateDeleteCollaborationPayload(request.payload);

    const { playlistId, userId } = request.payload;
    const { id: owner } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAvailableById({ id: playlistId, owner });
    await this._collaborationsService.deleteCollaboration({ playlistId, userId });

    const response = h.response({
      status: 'success',
      message: 'Kolaborator playlist berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = CollaborationsHandler;
