import { useAuth } from "../auth/AuthContext";
import ListLayout from "../components/ListLayout";

export default function ConsultaList() {
  const { authState } = useAuth();

  return (
    <div>
      <ListLayout
        title={'Listagem de Consultas'}
        columnsAndNames={[
          { column: "Código", nameInForm: "codigo" },
          { column: "Nome do Médico", nameInForm: "medicoNome" },
          { column: "CPF do Médico", nameInForm: "medicoCPF" },
          { column: "CRM do Médico", nameInForm: "crm" },
          { column: "Nome do Paciente", nameInForm: "pacienteNome" },
          { column: "CPF do Paciente", nameInForm: "pacienteCPF" },
          { column: "Peso", nameInForm: "peso" },
          { column: "Temperatura", nameInForm: "temperatura" },
          { column: "Data e Hora de Atendimento", nameInForm: "dataHoraAtendimento" },
          { column: "Descrição dos Sintomas", nameInForm: "descricaoSintomas" },
          { column: "Diagnóstico e Tratamento Sugerido", nameInForm: "diagnosticoETratamentoSugerido" },
          { column: "Status do Pagamento", nameInForm: "statusPagamento" },
        ]}
        emptyMessage={"Não há nenhuma consulta cadastrada!"}
        linkShow={"/consultas/form"}
        linkDelete={"/consultas"}
        linkGetData={"/consultas"}
        linkNew={"/consultas/form"}
        // aqui define que somente médicos podem cadastrar
        useAddNew={authState?.user?.role.includes(2)}
        useActions={false}
        useUpdate={false}
        authPermission={true}
        adminPermission={false}
      />
    </div>
  );
}
