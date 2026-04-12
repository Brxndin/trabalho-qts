export class Consulta {
    static statusDePagamento = Object.freeze({
        APAGAR : 1,
        PAGOPARCIAL : 2,
        ATRASADO : 3,
        PAGO : 4,
    });

    constructor({
        id,
        codigo,
        dataHoraAtendimento,
        pacienteCPF,
        pacienteNome,
        medicoCPF,
        medicoNome,
        medicoCRM,
        descricaoSintomas,
        temperatura,
        peso,
        diagnosticoETratamentoSugerido,
        statusPagamento
    }) {
        this.id = id;
        this.codigo = codigo;
        this.dataHoraAtendimento = dataHoraAtendimento;
        this.pacienteCPF = pacienteCPF;
        this.pacienteNome = pacienteNome;
        this.medicoCPF = medicoCPF;
        this.medicoNome = medicoNome;
        this.medicoCRM = medicoCRM;
        this.descricaoSintomas = descricaoSintomas;
        this.temperatura = temperatura;
        this.peso = peso;
        this.diagnosticoETratamentoSugerido = diagnosticoETratamentoSugerido;
        this.statusPagamento = statusPagamento;
    }
}
