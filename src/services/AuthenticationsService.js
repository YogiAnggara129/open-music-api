const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken({ refreshToken }) {
    const query = 'INSERT INTO authentications (token) VALUES ($1) RETURNING token';
    const result = await this._pool.query(query, [refreshToken]);

    if (!result.rowCount) {
      throw new InvariantError('Token gagal ditambahkan');
    }

    return result.rows[0].token;
  }

  async verifyRefreshToken({ refreshToken }) {
    const query = 'SELECT token FROM authentications WHERE token = $1';
    const result = await this._pool.query(query, [refreshToken]);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }

    return result.rows[0].token;
  }

  async deleteRefreshToken({ refreshToken }) {
    const query = 'DELETE FROM authentications WHERE token = $1 RETURNING token';
    const result = await this._pool.query(query, [refreshToken]);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }

    return result.rows[0].token;
  }
}

module.exports = AuthenticationsService;
