/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('Images', function(table) {
            table.increments('id').primary();
            table.binary('image').notNullable();
            table.integer('blog_id').unsigned().references('id').inTable('Blogs').onDelete('CASCADE');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('Images');
};
