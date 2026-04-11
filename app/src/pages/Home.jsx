import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { authState } = useAuth();

  useEffect(() => {
    if (!authState?.auth) {
      navigate("/forbidden");
    }
  }, [authState, navigate]);

  return (
    <div>
      <h2>Bem-vindo à Clínica de Cardiologia!</h2>
      <p>Aqui é possível visualizar suas consultas e muito mais!</p>
    </div>
  );
}
