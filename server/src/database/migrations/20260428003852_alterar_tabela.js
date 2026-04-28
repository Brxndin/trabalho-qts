/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable('consultas', function (table) {
        table.decimal('temperatura', 5, 2).notNullable().alter();
        table.decimal('peso', 5, 2).notNullable().alter();
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable('consultas', function (table) {
        table.integer('temperatura').notNullable().alter();
        table.integer('peso').notNullable().alter();
    });
}
