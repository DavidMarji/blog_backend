/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('Blogs', function(table) {
            table.increments('id').primary();
            table.integer('author_id').unsigned().notNullable().references('id').inTable('Users').onDelete("CASCADE");
            table.string('title', 50).notNullable();
            table.boolean('published').defaultTo(false).notNullable();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('Blogs');
};
