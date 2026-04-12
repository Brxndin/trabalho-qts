import { useParams } from "react-router-dom";
import FormLayout from "../components/FormLayout";
import { useAuth } from "../auth/AuthContext";

export default function PacienteForm() {
  const { id } = useParams();
  const { authState } = useAuth();

  return (
    <div>
      <FormLayout
        title={`${id ? 'Atualização' : 'Cadastro'} de Paciente`}
        componentsAndNames={[
          { label: "Nome", name: "nome", type: "text", placeholder: "Informe o nome", required: true },
          { label: "CPF", name: "cpf", type: "text", placeholder: "Informe o CPF", required: true },
          { label: "Telefone", name: "telefone", type: "text", placeholder: "Informe o telefone" },
          { label: "Data de Nascimento", name: "dataNascimento", type: "date", required: true },
          { label: "E-mail", name: "email", type: "email", placeholder: "Informe o e-mail", required: true },
        ]}
        submitButtonText={id ? 'Atualizar' : 'Cadastrar'}
        linkReturn={"/pacientes"}
        linkStore={'/pacientes'}
        linkGetData={'/pacientes'}
        linkUpdate={'/pacientes'}
        authPermission={true}
        // aqui define que somente funcionários podem cadastrar e editar
        createPermission={authState?.user?.role.includes(4)}
        updatePermission={authState?.user?.role.includes(4)}
      />
    </div>
  );
}
