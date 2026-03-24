import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import usersRoutes from './routes/UserRoutes.js';

// cria o app com express e configura tratamento das requests
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/usuarios', usersRoutes);

export { app };
