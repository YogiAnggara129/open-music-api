const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { PlaylistRole } = require('../utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getRole({ id, userId }) {
    const checkAvailabilityQuery = 'SELECT id FROM playlists WHERE id = $1';
    const checkAvailabilityResult = await this._pool.query(
      checkAvailabilityQuery,
      [id],
    );
    if (!checkAvailabilityResult.rowCount) {
      throw new NotFoundError('Playlist tidak valid');
    }

    const checkOwnerQuery = 'SELECT id FROM playlists WHERE id = $1 AND owner = $2';
    const checkOwnerResult = await this._pool.query(checkOwnerQuery, [
      id,
      userId,
    ]);
    if (checkOwnerResult.rowCount !== 0) {
      return PlaylistRole.owner;
    }

    const checkCollaboratorQuery = 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2';
    const checkCollaboratorResult = await this._pool.query(
      checkCollaboratorQuery,
      [id, userId],
    );
    if (checkCollaboratorResult.rowCount !== 0) {
      return PlaylistRole.collaborator;
    }

    return null;
  }

  async verifyNewPlaylist({ name, owner }) {
    const query = 'SELECT name FROM playlists WHERE name = $1 AND owner = $2';
    const result = await this._pool.query(query, [name, owner]);

    if (result.rowCount > 0) {
      throw new InvariantError('Playlist telah digunakan');
    }
  }

  async addPlaylist({ name, owner }) {
    await this.verifyNewPlaylist({ name, owner });

    const id = `playlist-${nanoid(16)}`;
    const query = 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id';
    const result = await this._pool.query(query, [id, name, owner]);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists({ userId }) {
    const query = `
    SELECT p.id id, p.name name, u.username username FROM playlists p
    LEFT JOIN collaborations c ON p.id = c.playlist_id
    LEFT JOIN users u ON p.owner = u.id
    WHERE p.owner = $1 OR c.user_id = $1`;
    const result = await this._pool.query(query, [userId]);

    return result.rows;
  }

  async deletePlaylistById({ id }) {
    const query = 'DELETE FROM playlists WHERE id = $1 RETURNING id';
    const result = await this._pool.query(query, [id]);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
