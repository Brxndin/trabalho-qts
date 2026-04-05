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

export function isEmail() {
    // verificar se vale a pena usar regex pra validar ou usar biblioteca
    // acho que não faz sentido baixar biblioteca só pra isso
}

export function isCPFValido() {
    // verificar pra usar uma função padrão
    // deve existir biblioteca, mas baixar dependência só pra isso não faz muito sentido
}
