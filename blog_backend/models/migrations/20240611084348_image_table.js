/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('Images', function(table) {
            table.increments('id').primary();
            table.string('imagePath').notNullable();
            table.integer('page_id').unsigned().notNullable().references('id').inTable('Pages').onDelete("CASCADE");
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('Images');
};
