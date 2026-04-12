import { useNavigate } from "react-router-dom";
import { useLayoutEffect } from "react";
import { setupInterceptors } from "../config/api";

// feito nesse formato para o interceptor se comportar como componente
const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  return children;
};

export default AxiosInterceptor;
