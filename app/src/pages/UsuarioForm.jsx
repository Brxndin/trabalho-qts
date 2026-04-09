import { useParams } from "react-router-dom";
import FormLayout from "../components/FormLayout";

export default function UsuarioForm() {
  const { id } = useParams();

  return (
    <div>
      <FormLayout
        title={'Cadastro de Usuários'}
        componentsAndNames={[
          { label: "Nome", name: "nome", type: "text", placeholder: 'Informe o nome', required: true },
          { label: "E-mail", name: "email", type: "email", placeholder: 'Informe o e-mail', required: true },
          { label: "Tipo", name: "tipo", type: "select", required: true, options: [
            { value: 1, text: "Administrador" },
            { value: 2, text: "Médico" },
            { value: 3, text: "Paciente" },
            { value: 4, text: "Funcionário" },
          ] },
          { label: "Senha", name: "senha", type: "password", placeholder: 'Informe a senha', required: true },
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
