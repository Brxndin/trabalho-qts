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
        description="Preencha os dados do paciente. CPF, telefone e demais campos possuem ajuda e máscara quando necessário."
        componentsAndNames={[
          { label: "Nome", name: "nome", type: "text", placeholder: "Informe o nome", required: true },
          { label: "CPF", name: "cpf", type: "text", placeholder: "Informe o CPF", required: true },
          { label: "Ocupação", name: "funcao", type: "text", placeholder: "Informe a ocupação", required: true },
          { label: "Telefone", name: "telefone", type: "text", placeholder: "Informe o telefone" },
          { label: "Endereço", name: "endereco", type: "text", placeholder: "Rua ou avenida", required: true },
          { label: "Número", name: "numero", type: "text", placeholder: "Número", required: true },
          { label: "Bairro", name: "bairro", type: "text", placeholder: "Bairro", required: true },
          { label: "CEP", name: "cep", type: "text", placeholder: "CEP", required: true },
          { label: "Data de Nascimento", name: "dataNascimento", type: "date", required: true },
          { label: "E-mail", name: "email", type: "email", placeholder: "Informe o e-mail", required: true },
        ]}
        submitButtonText={id ? 'Atualizar' : 'Cadastrar'}
        linkReturn={"/pacientes"}
        linkStore={'/pacientes'}
        linkGetData={'/pacientes'}
        linkUpdate={'/pacientes'}
        authPermission={true}
        createPermission={authState?.user?.role.includes(4)}
        updatePermission={authState?.user?.role.includes(4)}
      />
    </div>
  );
}
