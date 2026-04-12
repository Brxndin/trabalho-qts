import { useParams } from "react-router-dom";
import FormLayout from "../components/FormLayout";
import { useAuth } from "../auth/AuthContext";

export default function FuncionarioForm() {
  const { id } = useParams();
  const { authState } = useAuth();

  return (
    <div>
      <FormLayout
        title={`${id ? 'Atualização' : 'Cadastro'} de Funcionário`}
        componentsAndNames={[
          { label: "Nome", name: "nome", type: "text", placeholder: "Informe o nome", required: true },
          { label: "CPF", name: "cpf", type: "text", placeholder: "Informe o CPF", required: true },
          { label: "Função", name: "funcao", type: "text", placeholder: "Informe a função", required: true },
          { label: "Telefone", name: "telefone", type: "text", placeholder: "Informe o telefone" },
          { label: "Endereço", name: "endereco", type: "text", placeholder: "Informe o endereço" },
          { label: "E-mail", name: "email", type: "email", placeholder: "Informe o e-mail", required: true },
        ]}
        submitButtonText={id ? 'Atualizar' : 'Cadastrar'}
        linkReturn={"/funcionarios"}
        linkStore={'/funcionarios'}
        linkGetData={'/funcionarios'}
        linkUpdate={'/funcionarios'}
        authPermission={true}
        // aqui define que somente administradores podem cadastrar e editar
        createPermission={authState?.user?.role.includes(1)}
        updatePermission={authState?.user?.role.includes(1)}
      />
    </div>
  );
}
