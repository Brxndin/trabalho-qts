function errorHandler(error, req, res, next) {
    const status = error.status || error.statusCode || 500;

    // temporário, verificar pra depois colocar logs estruturados
    console.log(error);

    // resposta padrão para caso de erro na request
    const responseBody = {
        message: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
        // requestId: req.requestId,
    };

    // só mostra mensagem do erro se não for erro de sintaxe ou de servidor
    if (status < 500) {
        responseBody.message = error.message;
    }

    if ('auth' in error) {
        responseBody.auth = error.auth;
    }

    res.status(status).json(responseBody);
}

export default errorHandler;
