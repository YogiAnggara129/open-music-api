class ServerError extends Error {
  constructor(message = 'terjadi kegagalan pada server kami', statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
