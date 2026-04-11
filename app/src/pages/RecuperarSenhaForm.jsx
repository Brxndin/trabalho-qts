import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import FormLayout from "../components/FormLayout";

export default function RecuperarSenhaForm() {
  const navigate = useNavigate();

  const { authState } = useAuth();

  useEffect(() => {
    // se o usuário está autenticado, redireciona ele pra página principal
    if (authState?.auth) {
      navigate('/');
    }
  }, [authState, navigate]);

  return (
    <div>
      <FormLayout
        title={'Recuperar Senha'}
        description={'Informe seu e-mail para receber um link de alteração de senha'}
        componentsAndNames={[
          { label: "E-mail", name: "email", type: "email", placeholder: 'Informe o e-mail', required: true },
        ]}
        submitButtonText={'Enviar'}
        linkStore={'/auth/enviar-email-troca-senha'}
        afterSubmitSuccesFunction={(dadosRetorno) => {
          navigate('/login');
        }}
        updatePermission={true}
        createPermission={true}
      />
    </div>
  );
}
