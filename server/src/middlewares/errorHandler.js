function errorHandler(error, req, res, next) {
    try {
        const status = error.status ?? error.statusCode ?? 500;

        // temporário, verificar pra depois colocar logs estruturados
        console.log(error);

        // resposta padrão para caso de erro na request
        const responseBody = {
            message: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
            // data: {
            //     requestId: req.requestId,
            // },
        };

        // só mostra mensagem do erro se não for erro de sintaxe ou de servidor
        if (status < 500) {
            responseBody.message = error.message;
        }

        if ('auth' in error) {
            responseBody.data = {
                // ...responseBody.data,
                auth: error.auth,
            };
        }

        res.status(status).json(responseBody);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.'
        });
    }
}

export default errorHandler;
