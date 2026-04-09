import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Header() {
  const { authState } = useAuth();

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
  };

  return (
    <header>
      {authState.auth && (
        <>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/funcionarios" style={linkStyle}>Funcionários</Link>
          <Link to="/medicos" style={linkStyle}>Médicos</Link>
          <Link to="/pacientes" style={linkStyle}>Pacientes</Link>
          <Link to="/consultas" style={linkStyle}>Consultas</Link>
          <Link to="/logout" style={linkStyle}>Logout</Link>
        </>
      )}

      {!authState.auth && (
        <Link to="/login" style={linkStyle}>Login</Link>
      )}
    </header>
  );
}