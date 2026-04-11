import CustomError from './customError.js';

// remove valores undefined, além de manter somente dados permitidos
export function filtraDadosPermitidos(data, dadosPermitidos) {
    const dadosFiltrados = {};

    for (const chaveObjeto in dadosPermitidos) {
        const colunaBanco = dadosPermitidos[chaveObjeto];
        const valor = data[chaveObjeto];

        if (valor !== undefined) {
            dadosFiltrados[colunaBanco] = valor;
        }
    }

    return dadosFiltrados;
}

export function multiConcat(separador, ...strings) {
    let stringsFiltradas = [];

    for (const string of strings) {
        if (string !== null && string !== undefined && string !== '') {
            stringsFiltradas.push(string);
        }
    }

    return stringsFiltradas.join(separador);
}

export function isEmptyObject(object) {
    return object && Object.keys(object).length === 0;
}

export function isSenhaValida(senha) {
    const padraoSenha  = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&._-])[a-zA-Z\d@$!%*?&._-]{7,}$/;

    if (!padraoSenha.test(senha)) {
        throw new CustomError('A senha deve conter letras maiúsculas, minúsculas, números e símbolos e ter no mínimo 7 dígitos!', 400);
    }
}

export function isEmailValido(email) {
    const padraoEmail  = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;

    if (!padraoEmail.test(email)) {
        throw new CustomError('O e-mail informado é inválido!', 400);
    }
}

export function isCPFValido(cpf) {
    const digitosNaoNumericos = /\D/g;
    const digitosRepetidos = /^(\d)\1{10}$/;

    const cpfTratado = cpf.replace(digitosNaoNumericos, '');

    if (cpfTratado.length !== 11) {
        throw new CustomError('O CPF deve ter 11 dígitos!', 400);
    }

    if (digitosRepetidos.test(cpfTratado)) {
        throw new CustomError('O CPF não pode ser uma sequência de números repetidos!', 400);
    }

    const geraDigitoVerificador = (cpfInteiro, peso, digitoVerificador = null) => {
        let novoDigitoVerificador = '0';
        let soma = 0;
        let count = peso;

        for (const digito of cpfInteiro) {
            if (count < 2) {
                break;
            }

            if (digitoVerificador && count == 2) {
                soma += parseInt(digitoVerificador) * count;
            } else {
                soma += parseInt(digito) * count;
            }

            count--;
        }

        let resto = soma % 11;

        if (resto >= 2) {
            novoDigitoVerificador = `${11 - resto}`;
        }

        return novoDigitoVerificador;
    };

    let digitoVerificador1 = geraDigitoVerificador(cpfTratado, 10);
    let digitoVerificador2 = geraDigitoVerificador(cpfTratado, 11, digitoVerificador1);

    // aqui verifica se os digitos verificadores gerados são os mesmos informados no cpf original
    if (`${digitoVerificador1}${digitoVerificador2}` !== cpfTratado.slice(-2)) {
        throw new CustomError(`O CPF ${cpf} é inválido!`, 400);
    }
}
