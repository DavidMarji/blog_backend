/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('Blogs', function(table) {
            table.increments('id').primary();
            table.integer('author_id').unsigned().references('id').inTable('Users');
            table.string('title', 50).notNullable();
            table.string('text').notNullable();
            table.boolean('published').defaultTo(false);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('Blogs');
};
