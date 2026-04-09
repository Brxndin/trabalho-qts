import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import FormLayout from "../components/FormLayout";

export default function Login() {
  const navigate = useNavigate();

  const { authState, setAuthState } = useAuth();

  useEffect(() => {
    // se o usuário está autenticado, redireciona ele pra página principal
    if (authState?.auth) {
      navigate('/');
    }
  }, [authState, navigate]);

  return (
    <div>
      <FormLayout
        title={'Login'}
        componentsAndNames={[
          { label: "E-mail", name: "email", type: "email", placeholder: 'Informe o e-mail', required: true },
          { label: "Senha", name: "senha", type: "password", placeholder: 'Informe a senha', required: true },
        ]}
        submitButtonText={'Entrar'}
        linkStore={'/auth/login'}
        afterSubmitSuccesFunction={(dadosRetorno) => {
          setAuthState({
            token: dadosRetorno.token,
            user: dadosRetorno.user,
            auth: dadosRetorno.auth,
          });
        }}
      />
    </div>
  );
}
