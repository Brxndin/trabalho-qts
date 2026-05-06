import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import AxiosInterceptor from './AxiosInterceptor';

export default function Layout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/recuperar-senha', '/definir-senha'].includes(location.pathname);

  return (
    <AxiosInterceptor>
      <div className="app-shell">
        <Header />
        <main className={isAuthPage ? 'main-auth' : 'main-default'}>
          <Outlet />
        </main>
        {!isAuthPage && (
          <footer className="site-footer">
            <p>&copy; 2026 Cardio Clínica</p>
          </footer>
        )}
      </div>
    </AxiosInterceptor>
  );
}
