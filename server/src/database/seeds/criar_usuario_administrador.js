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
        // senha: Senha.123
        senha: '$2b$12$fkCox86SvdMTzA7c6XDWLuIEBeq7fPa2ST3Uql8iY5sFkgD/9erXi',
        cpf: null,
        endereco: null,
        telefone: null,
    });

    await knex('usuarios_tipos').insert({
        tipo: 1,
        usuario_id: usuarioId
    });
}
