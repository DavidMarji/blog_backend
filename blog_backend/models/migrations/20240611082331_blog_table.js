/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('Blogs', function(table) {
            table.increments('id').primary();
            table.integer('author_id').unsigned().notNullable().references('id').inTable('Users').onDelete("CASCADE");
            table.string('title', 50).unique().notNullable();
            table.boolean('published').defaultTo(false).notNullable();
            table.integer('number_of_pages').unsigned().notNullable();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('Images');
  await knex.schema.dropTable('Pages');
  return await knex.schema.dropTable('Blogs');
};
