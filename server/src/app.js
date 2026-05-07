import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/AuthRoutes.js';
import consultaRoutes from './routes/ConsultaRoutes.js';
import funcionarioRoutes from './routes/FuncionarioRoutes.js';
import medicoRoutes from './routes/MedicoRoutes.js';
import pacienteRoutes from './routes/PacienteRoutes.js';
import usuarioRoutes from './routes/UsuarioRoutes.js';

// cria o app com express e configura tratamento das requests
const app = express();

app.use(
    cors({
        origin: `http://${process.env.FRONT_HOST}:${process.env.FRONT_PORT}`,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(helmet());
app.use(express.json());

// limita o número de requisições por IP
const normalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
        message: 'Muitas requisições realizadas. Tente novamente em 15 minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/auth', authRoutes);
app.use('/usuarios', normalLimiter, usuarioRoutes);
app.use('/medicos', normalLimiter, medicoRoutes);
app.use('/funcionarios', normalLimiter, funcionarioRoutes);
app.use('/pacientes', normalLimiter, pacienteRoutes);
app.use('/consultas', normalLimiter, consultaRoutes);

// middleware para tratamento de erros
app.use(errorHandler);

export { app };
