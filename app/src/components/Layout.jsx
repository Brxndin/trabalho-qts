import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <>
      <Header/> 
      
      <main>
        <Outlet /> 
      </main>

      <footer>
        <p>&copy; 2026 Clínica de Cardiologia | Todos os direitos reservados.</p>
        <p>Feito por Brandon, Brenda, Gian, Mylena e Pedro Sperotto</p>
      </footer>
    </>
  );
}