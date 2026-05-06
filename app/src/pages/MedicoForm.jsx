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
          { label: "CRM", name: "crm", type: "text", placeholder: "Informe o CRM com 6 dígitos", required: true, maxLength: 6, help: "O CRM deve conter exatamente 6 dígitos." },
          { label: "Telefone", name: "telefone", type: "text", placeholder: "Informe o telefone" },
          { label: "Endereço", name: "endereco", type: "text", placeholder: "Rua ou avenida", required: true },
          { label: "Número", name: "numero", type: "text", placeholder: "Número", required: true },
          { label: "Bairro", name: "bairro", type: "text", placeholder: "Bairro", required: true },
          { label: "CEP", name: "cep", type: "text", placeholder: "CEP", required: true },
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
