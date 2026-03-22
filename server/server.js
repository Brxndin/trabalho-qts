import 'dotenv/config';
import { app } from './src/app.js';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

// inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://${HOST}:${PORT}`);
});
