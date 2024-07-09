/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('Users', function(table) {
            table.increments('id').primary();
            table.string('username', 50).unique().notNullable();
            table.string('password', 100).notNullable();
            table.string('email', 100).unique().notNullable();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return await knex.schema.dropTable('Users').dropTable('Blogs');
};
