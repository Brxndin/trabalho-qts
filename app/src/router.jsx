import { createBrowserRouter } from "react-router-dom";

// layout principal
import Layout from './components/Layout';

// páginas
import Home from './pages/Home';
// import UsuarioForm from './pages/UsuarioForm';
// import UsuarioList from './pages/UsuarioList';
import MedicoList from './pages/MedicoList';
import MedicoForm from './pages/MedicoForm';
import FuncionarioList from './pages/FuncionarioList';
import FuncionarioForm from './pages/FuncionarioForm';
import PacienteList from './pages/PacienteList';
import PacienteForm from './pages/PacienteForm';
import ConsultaList from './pages/ConsultaList';
import ConsultaForm from './pages/ConsultaForm';
import RecuperarSenhaForm from './pages/RecuperarSenhaForm';
import DefinirSenhaForm from './pages/DefinirSenhaForm';
import Login from './pages/Login';
import Logout from './pages/Logout';

function ForbiddenPage() {
  return (
    <section className="forbidden-page">
      <div className="forbidden-card">
        <div className="forbidden-icon" aria-hidden="true">🔒</div>
        <h1 className="forbidden-title">Acesso negado</h1>
        <p className="forbidden-text">
          Você não tem permissão para acessar essa tela.
        </p>
      </div>
    </section>
  );
}

export const router = createBrowserRouter([
  {
    path: '/', 
    // aqui é o layout padrão
    element: <Layout/>,
    
    // aqui são as páginas que serão usadas dentro do layout padrão
    children: [
      {
        index: true,
        element: <Home/>,
      },
      {
        path: 'login',
        element: <Login/>,
      },
      {
        path: 'logout',
        element: <Logout/>,
      },
      // {
      //   path: 'usuarios',
      //   element: <UsuarioList/>,
      // },
      // {
      //   path: 'usuarios/form/:id?',
      //   element: <UsuarioForm/>,
      // },
      {
        path: 'medicos',
        element: <MedicoList/>,
      },
      {
        path: 'medicos/form/:id?',
        element: <MedicoForm/>,
      },
      {
        path: 'funcionarios',
        element: <FuncionarioList/>,
      },
      {
        path: 'funcionarios/form/:id?',
        element: <FuncionarioForm/>,
      },
      {
        path: 'pacientes',
        element: <PacienteList/>,
      },
      {
        path: 'pacientes/form/:id?',
        element: <PacienteForm/>,
      },
      {
        path: 'consultas',
        element: <ConsultaList/>,
      },
      {
        path: 'consultas/form/:id?',
        element: <ConsultaForm/>,
      },
      {
        path: 'definir-senha',
        element: <DefinirSenhaForm/>,
      },
      {
        path: 'recuperar-senha',
        element: <RecuperarSenhaForm/>,
      },
      {
        path: 'forbidden',
        element: <ForbiddenPage/>,
      },
      {
        path: '*',
        element: <h1>404: Página Não Encontrada!</h1>,
      },
    ],
  },
]);
