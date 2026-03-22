import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

// cria o app com express e configura tratamento das requests
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ mensagem: 'Commit inicial' });
});

export { app };
