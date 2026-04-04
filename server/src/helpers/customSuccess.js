// o objeto desestruturado ao invés de argumentos normais é pra chamar em qualquer ordem
export default function customSuccess(res, { data = null, message = null, statusCode = 200 } = {}) {
    const responseBody = {
        message: message ?? 'Requisição finalizada com sucesso.',
    };

    if (data !== null && data !== undefined) {
        responseBody.data = data;
    }

    return res.status(statusCode).json(responseBody);
}
