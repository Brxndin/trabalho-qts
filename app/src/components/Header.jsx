import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import Brand from "./Brand";

export default function Header() {
  const { authState } = useAuth();
  const location = useLocation();

  const isAuthPage = useMemo(
    () => ["/login", "/recuperar-senha", "/definir-senha"].includes(location.pathname),
    [location.pathname]
  );

  if (isAuthPage) return null;

  const roles = Array.isArray(authState?.user?.role) ? authState.user.role : [];
  const isPaciente = roles.some((role) => Number(role) === 3);

  const isAdmin = roles.some((role) => Number(role) === 1);
  const isMedico = roles.some((role) => Number(role) === 2);
  const isFuncionario = roles.some((role) => Number(role) === 4);

  const items = authState?.auth
    ? [
        { to: "/", label: "Início" },
        ...(isAdmin ? [{ to: "/funcionarios", label: "Funcionários" }] : []),
        ...(isFuncionario ? [{ to: "/medicos", label: "Médicos" }] : []),
        ...(isFuncionario ? [{ to: "/pacientes", label: "Pacientes" }] : []),
        ...(isMedico ? [{ to: "/consultas", label: "Consultas" }] : []),
      ]
    : [{ to: "/login", label: "Login" }];

  const fecharMenu = () => {
    const menu = document.getElementById("menuLateral");

    if (menu && window.bootstrap) {
      const instancia =
        window.bootstrap.Offcanvas.getInstance(menu) ||
        new window.bootstrap.Offcanvas(menu);

      instancia.hide();
    }
  };

  return (
    <>
      <header className="topbar">
        {authState?.auth && !isPaciente && (
          <button
            className="menu-button"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#menuLateral"
            aria-controls="menuLateral"
            aria-label="Abrir menu"
          >
            ☰
          </button>
        )}

        <Link to={authState?.auth ? "/" : "/login"} className="brand-link">
          <Brand compact />
        </Link>

        {authState?.auth && (
          <Link to="/logout" className="patient-logout-button">
            Sair
          </Link>
        )}
      </header>

      {authState?.auth && !isPaciente && (
        <div
          className="offcanvas offcanvas-start app-offcanvas"
          tabIndex="-1"
          id="menuLateral"
          aria-labelledby="menuLateralLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="menuLateralLabel">
              Menu
            </h5>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Fechar"
            />
          </div>

          <div className="offcanvas-body">
            <nav className="sidebar-nav-bootstrap">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`sidebar-link-bootstrap ${
                    location.pathname === item.to ? "active" : ""
                  }`}
                  onClick={fecharMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}