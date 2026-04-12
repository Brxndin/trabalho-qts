export class Paciente {
    constructor({ id, nome, cpf, telefone, dataNascimento, email }) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.email = email;
    }
}
