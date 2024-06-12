/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('Pages', function(table) {
            table.increments('id').primary();
            table.integer('blog_id').unsigned().notNullable().references('id').inTable('Blogs').onDelete("CASCADE");
            table.integer('page_number').unsigned().notNullable();
            table.string('page_content').notNullable();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('Pages');
};
