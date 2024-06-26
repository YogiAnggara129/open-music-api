const autoBind = require('auto-bind');
const { PlaylistRole } = require('../../utils');
const AuthorizationError = require('../../exceptions/AuthorizationError');

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
    const role = await this._playlistsService.getRole({ id: playlistId, userId: owner });
    if (role !== PlaylistRole.owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }

    const id = await this._collaborationsService.addCollaboration({ playlistId, userId });

    const response = h.response({
      status: 'success',
      message: 'Kolaborator playlist berhasil ditambahkan',
      data: {
        collaborationId: id,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateDeleteCollaborationPayload(request.payload);

    const { playlistId, userId } = request.payload;
    const { id: owner } = request.auth.credentials;
    const role = await this._playlistsService.getRole({
      id: playlistId,
      userId: owner,
    });
    if (role !== PlaylistRole.owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }
    await this._collaborationsService.deleteCollaboration({
      playlistId,
      userId,
    });

    const response = h.response({
      status: 'success',
      message: 'Kolaborator playlist berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = CollaborationsHandler;
