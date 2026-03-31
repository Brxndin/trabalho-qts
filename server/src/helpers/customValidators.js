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
