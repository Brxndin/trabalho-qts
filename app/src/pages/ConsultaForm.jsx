import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormLayout from "../components/FormLayout";
import { useAuth } from "../auth/AuthContext";
import dayjs from "dayjs";

export default function ConsultaForm() {
  const { id } = useParams();
  const { authState } = useAuth();

  const salvarConsultaLocalPaciente = (dadosRetorno, payload, dadosTela) => {
    if (id) return;

    const consultasSalvas = JSON.parse(localStorage.getItem("consultasPacienteLocal") || "[]");

    const novaConsulta = {
      id: dadosRetorno?.id || Date.now(),
      codigo: dadosTela.codigo || dadosRetorno?.codigo || Date.now(),
      dataHoraAtendimento: dadosTela.dataHoraAtendimento || dayjs().format("YYYY-MM-DD HH:mm:ss"),
      pacienteCPF: String(dadosTela.pacienteCPF || payload.pacienteCPF || "").replace(/\D/g, ""),
      pacienteNome: dadosTela.pacienteNome || "",
      medicoCPF: String(dadosTela.medicoCPF || payload.medicoCPF || "").replace(/\D/g, ""),
      medicoNome: dadosTela.medicoNome || "",
      medicoCRM: dadosTela.crm || dadosTela.medicoCRM || "",
      peso: dadosTela.peso || payload.peso || "",
      temperatura: dadosTela.temperatura || payload.temperatura || "",
      descricaoSintomas: dadosTela.descricaoSintomas || payload.descricaoSintomas || "",
      diagnosticoETratamentoSugerido:
        dadosTela.diagnosticoETratamentoSugerido || payload.diagnosticoETratamentoSugerido || "",
      statusPagamento: dadosTela.statusPagamento || payload.statusPagamento || "",
    };

    localStorage.setItem(
      "consultasPacienteLocal",
      JSON.stringify([...consultasSalvas, novaConsulta])
    );
  };

  return (
    <div>
      <FormLayout
        title={"Cadastro de Consultas"}
        componentsAndNames={[
          { label: "Código", name: "codigo", type: "text", placeholder: "Código da consulta", disabled: true },
          { label: "CPF do Médico", name: "medicoCPF", type: "text", placeholder: "Informe o CPF do médico", required: true, readOnly: true, disabled: true },
          { label: "Nome do Médico", name: "medicoNome", type: "text", placeholder: "Nome do médico", disabled: true },
          { label: "CRM do Médico", name: "crm", type: "text", placeholder: "CRM do médico", disabled: true },

          {
            label: "CPF do Paciente",
            name: "pacienteCPF",
            type: "text",
            placeholder: "Informe o CPF do paciente",
            required: true,
            onBlur: (api, setData, value) => {
              const cpfLimpo = String(value || "").replace(/\D/g, "");

              if (!cpfLimpo) {
                setData((prevState) => {
                  return {
                    ...prevState,
                    pacienteCPF: "",
                    pacienteNome: "",
                  };
                });

                return;
              }

              api
                .get(`/consultas/paciente/${cpfLimpo}`)
                .then((res) => {
                  setData((prevState) => {
                    return {
                      ...prevState,
                      ...res.data.data,
                    };
                  });
                })
                .catch(() => {
                  setData((prevState) => {
                    return {
                      ...prevState,
                      pacienteNome: "",
                    };
                  });

                  toast.error("Cadastro não encontrado. Contate um funcionário.");
                });
            },
          },

          { label: "Nome do Paciente", name: "pacienteNome", type: "text", placeholder: "Nome do paciente", disabled: true },
          { label: "Peso", name: "peso", placeholder: "Informe o peso do paciente", type: "text", required: true },
          { label: "Temperatura", name: "temperatura", placeholder: "Informe a temperatura do paciente", type: "text", required: true },
          { label: "Data e Hora de Atendimento", name: "dataHoraAtendimento", type: "datetime-local", value: dayjs().format("YYYY-MM-DD HH:mm:ss"), disabled: true },
          { label: "Descrição dos Sintomas", name: "descricaoSintomas", placeholder: "Descreva os sintomas do paciente", type: "textarea", required: true },
          { label: "Diagnóstico e Tratamento Sugerido", name: "diagnosticoETratamentoSugerido", placeholder: "Descreva o diagnóstico e o tratamento sugerido para o paciente", type: "textarea", required: true },
          {
            label: "Status do Pagamento",
            name: "statusPagamento",
            placeholder: "Informe o status do pagamento",
            type: "select",
            required: true,
            options: [
              { value: 1, text: "A Pagar" },
              { value: 2, text: "Pago Parcialmente" },
              { value: 3, text: "Atrasado" },
              { value: 4, text: "Pago" },
            ],
          },
        ]}
        submitButtonText={id ? "Atualizar" : "Cadastrar"}
        linkReturn={"/consultas"}
        linkStore={"/consultas"}
        linkGetData={"/consultas"}
        linkUpdate={"/consultas"}
        authPermission={true}
        createPermission={authState?.user?.role.includes(2)}
        updatePermission={authState?.user?.role.includes(2)}
        afterSubmitSuccesFunction={salvarConsultaLocalPaciente}
        initialSetDataFunction={(api, setData) => {
          api
            .get(`/consultas/medico/${authState?.user?.id}`)
            .then((res) => {
              setData((prevState) => {
                return {
                  ...prevState,
                  ...res.data.data,
                };
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      />
    </div>
  );
}