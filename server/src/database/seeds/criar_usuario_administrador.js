/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    await knex('usuarios').del();
    await knex('usuarios_tipos').del();

    const [usuarioId] = await knex('usuarios').insert({
        nome: 'Administrador',
        email: 'admin@ifrs.edu.br',
        // senha: 12345678
        senha: '$2a$12$zpCIf21cwAq.kO1.4bpdEekHjIVKiXhY7GW/JV7ugEeuemPTX49HG',
        cpf: null,
        endereco: null,
        telefone: null,
    });

    await knex('usuarios_tipos').insert({
        tipo: 1,
        usuario_id: usuarioId
    });
}
