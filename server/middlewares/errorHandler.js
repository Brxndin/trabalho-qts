
function errorHandler(error, req, res, next) {
    const status = error.status || error.statusCode || 500;

    // resposta padrão para caso de erro na request
    const responseBody = {
        error: error,
        message: error.message,
        // requestId: req.requestId,
    };

    if ('auth' in error) {
        responseBody.auth = error.auth;
    }

    // temporário, verificar pra depois colocar logs estruturados
    console.log(error);

    res.status(status).json(responseBody);
}

export default errorHandler;
