import { useParams } from "react-router-dom";
import FormLayout from "../components/FormLayout";
import { useAuth } from "../auth/AuthContext";
import dayjs from "dayjs";

export default function ConsultaForm() {
  const { id } = useParams();
  const { authState } = useAuth();

  // to do
  // aqui terá umas funcionalidades especiais
  // dados do médico já deverão vir carregados (é possível verificando quem está logado)
  // ao preencher cpf do paciente e tirar o foco do campo, deverá buscar os dados dele para preenchimento ou avisar que ele não existe

  return (
    <div>
      <FormLayout
        title={'Cadastro de Consultas'}
        componentsAndNames={[
          { label: "Código", name: "codigo", type: "text", placeholder: "Código da consulta", disabled: true },
          { label: "CPF do Médico", name: "medicoCPF", type: "text", placeholder: "Informe o CPF do médico", required: true },
          { label: "Nome do Médico", name: "medicoNome", type: "text", placeholder: "Nome do médico", disabled: true },
          { label: "CRM do Médico", name: "crm", type: "text", placeholder: "CRM do médico", disabled: true },
          { label: "CPF do Paciente", name: "pacienteCPF", type: "text", placeholder: "Informe o CPF do paciente", required: true },
          { label: "Nome do Paciente", name: "pacienteNome", type: "text", placeholder: "Nome do paciente", disabled: true },
          { label: "Peso", name: "peso", placeholder: "Informe o peso do paciente", type: "text", required: true },
          { label: "Temperatura", name: "temperatura", placeholder: "Informe a temperatura do paciente", type: "text", required: true },
          { label: "Data e Hora de Atendimento", name: "dataHoraAtendimento", type: "datetime-local", value: dayjs().format('YYYY-MM-DD HH:mm:ss'), disabled: true },
          { label: "Descrição dos Sintomas", name: "descricaoSintomas", placeholder: "Descreva os sintomas do paciente", type: "textarea", required: true },
          { label: "Diagnóstico e Tratamento Sugerido", name: "diagnosticoETratamentoSugerido", placeholder: "Descreva o diagnóstico e o tratamento sugerido para o paciente", type: "textarea", required: true },
          { label: "Status do Pagamento", name: "statusPagamento", placeholder: "Informe o status do pagamento", type: "text", required: true },
          // verificar dados restantes
        ]}
        submitButtonText={id ? 'Atualizar' : 'Cadastrar'}
        linkReturn={"/consultas"}
        linkStore={'/consultas'}
        linkGetData={'/consultas'}
        linkUpdate={'/consultas'}
        authPermission={true}
        // aqui define que somente médicos podem cadastrar e editar
        createPermission={authState?.user?.role.includes(2)}
        updatePermission={authState?.user?.role.includes(2)}
      />
    </div>
  );
}
