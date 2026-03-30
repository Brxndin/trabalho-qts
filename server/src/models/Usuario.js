export class Usuario {
    static tipos = Object.freeze({
        ADM : 1,
        MEDICO : 2,
        PACIENTE : 3,
        FUNCIONARIO : 4,
    });

    constructor({ id, nome, email, tipos, senha }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.tipos = tipos;
        this.senha = senha;
    }
}
