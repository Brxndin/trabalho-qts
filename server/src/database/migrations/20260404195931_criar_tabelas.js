/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('usuarios', function (table) {
        table.increments('id').primary();
        table.string('nome', 200).notNullable();
        table.string('email', 200).notNullable();
        table.string('senha', 200);
        table.specificType('cpf', 'char(11)');
        table.string('endereco', 200);
        table.string('telefone', 100);
    });

    await knex.schema.createTable('usuarios_tipos', function (table) {
        table.increments('id').primary();
        table.integer('tipo').notNullable();
        table.integer('usuario_id').notNullable().unsigned();
        
        table.foreign('usuario_id').references('id').inTable('usuarios');
    });

    await knex.schema.createTable('recuperacao_senhas', function (table) {
        table.increments('id').primary();
        table.string('token', 200).notNullable();
        table.dateTime('data_expiracao').notNullable();
        table.integer('usuario_id').notNullable().unsigned();
        
        table.foreign('usuario_id').references('id').inTable('usuarios');
    });

    await knex.schema.createTable('medicos', function (table) {
        table.increments('id').primary();
        table.string('crm', 200).notNullable();
        table.integer('usuario_id').notNullable().unsigned();
        
        table.foreign('usuario_id').references('id').inTable('usuarios');
    });

    await knex.schema.createTable('funcionarios', function (table) {
        table.increments('id').primary();
        table.string('funcao', 200).notNullable();
        table.integer('usuario_id').notNullable().unsigned();
        
        table.foreign('usuario_id').references('id').inTable('usuarios');
    });

    await knex.schema.createTable('pacientes', function (table) {
        table.increments('id').primary();
        table.date('data_nascimento').notNullable();
        table.integer('usuario_id').notNullable().unsigned();
        
        table.foreign('usuario_id').references('id').inTable('usuarios');
    });

    await knex.schema.createTable('consultas', function (table) {
        table.increments('id').primary();
        table.integer('codigo').notNullable();
        table.dateTime('data_hora_atendimento').notNullable();
        table.string('descricao_sintomas', 200).notNullable();
        table.integer('temperatura').notNullable();
        table.integer('peso').notNullable();
        table.text('diagnostico_e_tratamento_sugerido').notNullable();
        table.integer('status_pagamento').notNullable();
        table.integer('paciente_id').notNullable().unsigned();
        table.integer('medico_id').notNullable().unsigned();
        
        table.foreign('paciente_id').references('id').inTable('pacientes');
        table.foreign('medico_id').references('id').inTable('medicos');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('consultas');
    await knex.schema.dropTableIfExists('pacientes');
    await knex.schema.dropTableIfExists('funcionarios');
    await knex.schema.dropTableIfExists('medicos');
    await knex.schema.dropTableIfExists('recuperacao_senhas');
    await knex.schema.dropTableIfExists('usuarios_tipos');
    await knex.schema.dropTableIfExists('usuarios');
}
