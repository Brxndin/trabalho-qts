import { useParams } from "react-router-dom";
import FormLayout from "../components/FormLayout";
import { useAuth } from "../auth/AuthContext";

export default function MedicoForm() {
  const { id } = useParams();
  const { authState } = useAuth();

  return (
    <div>
      <FormLayout
        title={`${id ? 'Atualização' : 'Cadastro'} de Médico`}
        componentsAndNames={[
          { label: "Nome", name: "nome", type: "text", placeholder: "Informe o nome", required: true },
          { label: "CPF", name: "cpf", type: "text", placeholder: "Informe o CPF", required: true },
          { label: "CRM", name: "crm", type: "text", placeholder: "Informe o CRM", required: true },
          { label: "Telefone", name: "telefone", type: "text", placeholder: "Informe o telefone" },
          { label: "Endereço", name: "endereco", type: "text", placeholder: "Informe o endereço" },
          { label: "E-mail", name: "email", type: "email", placeholder: "Informe o e-mail", required: true },
        ]}
        submitButtonText={id ? 'Atualizar' : 'Cadastrar'}
        linkReturn={"/medicos"}
        linkStore={'/medicos'}
        linkGetData={'/medicos'}
        linkUpdate={'/medicos'}
        authPermission={true}
        // aqui define que somente funcionários podem cadastrar e editar
        createPermission={authState?.user?.role.includes(4)}
        updatePermission={authState?.user?.role.includes(4)}
      />
    </div>
  );
}
