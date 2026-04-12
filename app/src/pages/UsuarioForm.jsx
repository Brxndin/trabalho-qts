import { useParams } from "react-router-dom";
import FormLayout from "../components/FormLayout";
import { useAuth } from "../auth/AuthContext";

export default function UsuarioForm() {
  const { id } = useParams();
  const { authState } = useAuth();

  return (
    <div>
      <FormLayout
        title={`${id ? 'Atualização' : 'Cadastro'} de Usuário`}
        componentsAndNames={[
          { label: "Nome", name: "nome", type: "text", placeholder: 'Informe o nome', required: true },
          { label: "E-mail", name: "email", type: "email", placeholder: 'Informe o e-mail', required: true },
          // to do
          // aqui deve ser uma lista de checkbox
          // isso porque o usuário pode ser mais de um ao mesmo tempo
          // verificar, na verdade, se essa tela vai ser usada em algum momento
          { label: "Tipo", name: "tipo", type: "select", required: true, options: [
            { value: 1, text: "Administrador" },
            { value: 2, text: "Médico" },
            { value: 3, text: "Paciente" },
            { value: 4, text: "Funcionário" },
          ] },
        ]}
        submitButtonText={id ? 'Atualizar' : 'Cadastrar'}
        linkReturn={"/usuarios"}
        linkStore={'/usuarios'}
        linkGetData={'/usuarios'}
        linkUpdate={'/usuarios'}
        authPermission={true}
        createPermission={authState?.user?.role.includes(1)}
        updatePermission={authState?.user?.role.includes(1)}
      />
    </div>
  );
}
