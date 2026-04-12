import { Outlet } from 'react-router-dom';
import Header from './Header';
import AxiosInterceptor from './AxiosInterceptor';

export default function Layout() {
  return (
    <AxiosInterceptor>
      <Header/> 
      
      <main>
        <Outlet /> 
      </main>

      <footer>
        <p>&copy; 2026 Clínica de Cardiologia | Todos os direitos reservados.</p>
        <p>Feito por Brandon, Brenda, Gian, Mylena e Pedro Sperotto</p>
      </footer>
    </AxiosInterceptor>
  );
}