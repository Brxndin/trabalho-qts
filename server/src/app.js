import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import usuarioRoutes from './routes/UsuarioRoutes.js';
import medicoRoutes from './routes/MedicoRoutes.js';
import funcionarioRoutes from './routes/FuncionarioRoutes.js';
import pacienteRoutes from './routes/PacienteRoutes.js';
import consultaRoutes from './routes/ConsultaRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

// cria o app com express e configura tratamento das requests
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/medicos', medicoRoutes);
app.use('/funcionarios', funcionarioRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/consultas', consultaRoutes);

// middleware para tratamento de erros
app.use(errorHandler);

export { app };
