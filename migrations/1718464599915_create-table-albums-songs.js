/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      unique: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      unique: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      default: null,
      notNull: false,
    },
    album_id: {
      type: 'VARCHAR(50)',
      default: null,
      notNull: false,
      references: 'albums',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('songs');
  pgm.dropTable('albums');
};
