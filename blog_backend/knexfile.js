// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'several',
      password: '123',
      database: 'blog_db'
    },
    migrations: {
      directory: './models/migrations'
    }
  }

};
