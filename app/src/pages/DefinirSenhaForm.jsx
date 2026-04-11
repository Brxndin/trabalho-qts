import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import FormLayout from "../components/FormLayout";

export default function DefinirSenhaForm() {
  const navigate = useNavigate();

  const [ searchParams ] = useSearchParams();
  const { authState } = useAuth();

  const token = searchParams.get('token');

  useEffect(() => {
    // se o usuário está autenticado, redireciona ele pra página principal
    if (authState?.auth) {
      navigate('/');
    }
  }, [authState, navigate]);

  return (
    <div>
      <FormLayout
        title={'Definir Senha'}
        description={'Informe sua nova senha no campo abaixo'}
        componentsAndNames={[
          { label: "Senha", name: "senha", type: "password", placeholder: 'Informe a senha', required: true },
        ]}
        submitButtonText={'Atualizar'}
        linkStore={`/auth/definir-senha/${token}`}
        afterSubmitSuccesFunction={(dadosRetorno) => {
          navigate('/login');
        }}
        updatePermission={true}
        createPermission={true}
      />
    </div>
  );
}
