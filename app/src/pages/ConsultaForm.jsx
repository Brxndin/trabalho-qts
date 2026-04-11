import { useParams } from "react-router-dom";
import FormLayout from "../components/FormLayout";
import { useAuth } from "../auth/AuthContext";

export default function ConsultaForm() {
  const { id } = useParams();
  const { authState } = useAuth();

  // to do
  // aqui terá umas funcionalidades especiais
  // dados do médico já deverão vir carregados (é possível verificando quem está logado)
  // ao preencher cpf do paciente e tirar o foco do campo, deverá buscar os dados dele para preenchimento ou avisar que ele não existe
  // Esses campos de preenchimento automático devem estar bloqueados para edição, desenvolver isso no form padrão
  // data deverá ser a atual por padrão

  return (
    <div>
      <FormLayout
        title={'Cadastro de Consultas'}
        componentsAndNames={[
          { label: "CPF do Médico", name: "cpfMedico", type: "text", placeholder: "Informe o CPF do Médico", required: true },
          { label: "Nome do Médico", name: "nomeMedico", type: "text", placeholder: "Nome do Médico", required: true },
          { label: "CRM do Médico", name: "crm", type: "text", placeholder: "CRM do Médico", required: true },
          { label: "CPF do Paciente", name: "cpfPaciente", type: "text", placeholder: "Informe o CPF do Paciente", required: true },
          { label: "Nome do Paciente", name: "nomePaciente", type: "text", placeholder: "Nome do Paciente", required: true },
          { label: "Data e Hora de Atendimento", name: "data_hora_atendimento", type: "date", required: true },
          // verificar dados restantes
        ]}
        submitButtonText={id ? 'Atualizar' : 'Cadastrar'}
        linkReturn={"/consultas"}
        linkStore={'/consultas'}
        linkGetData={'/consultas'}
        linkUpdate={'/consultas'}
        authPermission={true}
        // aqui define que somente funcionários podem cadastrar e editar
        createPermission={authState?.user?.role.includes(4)}
        updatePermission={authState?.user?.role.includes(4)}
      />
    </div>
  );
}
