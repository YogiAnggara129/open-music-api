const autoBind = require('auto-bind');
const { exportPlaylistsQueue } = require('../../constants');
const { PlaylistRole } = require('../../utils');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class ExportsHandler {
  constructor({ producerService, playlistsService, validator }) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;
    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validatePostExportPlaylistsPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;
    const { targetEmail } = request.payload;

    const role = await this._playlistsService.getRole({ id: playlistId, userId });
    if (role !== PlaylistRole.owner) {
      throw new AuthorizationError('Anda tidak berhak untuk mengekspor playlist');
    }

    const message = {
      playlistId,
      targetEmail,
    };

    await this._producerService.sendMessage(exportPlaylistsQueue, JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(200);
    return response;
  }
}

module.exports = ExportsHandler;
