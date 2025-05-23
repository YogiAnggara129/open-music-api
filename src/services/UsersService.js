const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyNewUsername({ username }) {
    const query = 'SELECT username FROM users WHERE username = $1';
    const result = await this._pool.query(query, [username]);

    if (result.rowCount > 0) {
      throw new InvariantError('Username telah digunakan');
    }
  }

  async verifyUserCredential({ username, password }) {
    const query = 'SELECT id, password FROM users WHERE username = $1';
    const result = await this._pool.query(query, [username]);

    if (!result.rowCount) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      result.rows[0].password,
    );

    if (!isPasswordValid) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return result.rows[0].id;
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername({ username });
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id';
    const result = await this._pool.query(query, [
      id,
      username,
      hashedPassword,
      fullname,
    ]);

    if (!result.rowCount) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }
}

module.exports = UsersService;
