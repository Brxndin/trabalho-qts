import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { api } from "../config/api";

export default function Home() {
  const navigate = useNavigate();
  const { authState } = useAuth();

  const roles = Array.isArray(authState?.user?.role) ? authState.user.role : [];
  const [dadosPaciente, setDadosPaciente] = useState(null);
  const [consultasPaciente, setConsultasPaciente] = useState([]);

  const temPerfil = (perfil) => roles.some((role) => Number(role) === perfil);
  const isPaciente = temPerfil(3);
  const exibirAvisosEquipe = roles.some((role) => [1, 2, 4].includes(Number(role)));

  useEffect(() => {
    if (!authState?.auth) {
      navigate("/login");
      return;
    }

    if (isPaciente) {
      api
        .get("/pacientes")
        .then((res) => {
          const pacientes = res.data.data || [];

          const pacienteLogado = pacientes.find((paciente) => {
            return (
              Number(paciente.usuarioId) === Number(authState?.user?.id) ||
              String(paciente.nome || "").toUpperCase() ===
                String(authState?.user?.name || "").toUpperCase()
            );
          });

          if (pacienteLogado) {
            setDadosPaciente(pacienteLogado);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      api
        .get("/consultas")
        .then((res) => {
          setConsultasPaciente(res.data.data || []);
        })
        .catch((error) => {
          console.log(error);
          setConsultasPaciente([]);
        });
    }
  }, [authState?.auth, authState?.user?.id, authState?.user?.name, navigate, isPaciente]);

  const podeVer = (permissoes) => {
    return (
      permissoes.length === 0 ||
      permissoes.some((permissao) =>
        roles.some((role) => Number(role) === permissao)
      )
    );
  };

  const abrirPagina = (rota, permissoes = []) => {
    if (podeVer(permissoes)) {
      navigate(rota);
      return;
    }

    navigate("/forbidden");
  };

  const formatarData = (data) => {
    if (!data) return "-";

    const dataTexto = String(data);

    if (dataTexto.includes("T")) {
      const dataObj = new Date(dataTexto);

      if (!Number.isNaN(dataObj.getTime())) {
        return dataObj.toLocaleString("pt-BR");
      }
    }

    if (dataTexto.includes("-")) {
      const [ano, mes, resto] = dataTexto.split("-");
      const [dia, hora] = String(resto || "").split(" ");

      if (dia && mes && ano && hora) return `${dia}/${mes}/${ano} ${hora}`;
      if (dia && mes && ano) return `${dia}/${mes}/${ano}`;
    }

    return dataTexto;
  };

  const formatarCPF = (cpf) => {
    const cpfLimpo = String(cpf || "").replace(/\D/g, "");

    if (cpfLimpo.length !== 11) return cpf || "-";

    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatarTelefone = (telefone) => {
    const numeros = String(telefone || "").replace(/\D/g, "");

    if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    return telefone || "-";
  };

  const formatarStatusPagamento = (status) => {
    const statusTexto = {
      1: "A Pagar",
      2: "Pago Parcialmente",
      3: "Atrasado",
      4: "Pago",
    };

    return statusTexto[Number(status)] || status || "-";
  };

  const cards = [
    {
      titulo: "Médicos",
      descricao: "Gerencie cadastros, CRM e dados de contato.",
      rota: "/medicos",
      permissoes: [4],
    },
    {
      titulo: "Funcionários",
      descricao: "Organize equipe, funções e acessos do sistema.",
      rota: "/funcionarios",
      permissoes: [1],
    },
    {
      titulo: "Pacientes",
      descricao: "Consulte e atualize informações cadastrais rapidamente.",
      rota: "/pacientes",
      permissoes: [4],
    },
    {
      titulo: "Consultas",
      descricao: "Acompanhe atendimentos e status de pagamento.",
      rota: "/consultas",
      permissoes: [2],
    },
  ];

  const dicasSaude = [
    "Beba água ao longo do dia e evite esperar sentir muita sede.",
    "Faça pequenas pausas para alongar o corpo durante longos períodos sentado.",
    "Mantenha uma rotina de sono regular sempre que possível.",
    "Procure atendimento médico se sintomas persistirem ou piorarem.",
  ];

  const avisosEquipe = [
    {
      icone: "☕",
      titulo: "Missão cafeteira",
      texto: "Se o café acabou, complete a cafeteira e salve o humor da equipe.",
    },
    {
      icone: "🧼",
      titulo: "Sala brilhando",
      texto: "Depois do atendimento, deixe a sala pronta para o próximo paciente.",
    },
    {
      icone: "📝",
      titulo: "Cadastro em dia",
      texto: "Atualize os dados com carinho para ninguém virar detetive depois.",
    },
    {
      icone: "🩺",
      titulo: "Modo doutor(a)",
      texto: "Sintomas primeiro, café depois. Ou quase isso.",
    },
    {
      icone: "🧠",
      titulo: "Administrador ninja",
      texto: "Se mexer nas permissões, respire fundo e confira duas vezes.",
    },
    {
      icone: "😄",
      titulo: "Gentileza também cura",
      texto: "Um bom atendimento começa com um sorriso e um sistema organizado.",
    },
  ];

  const dicasPaciente = [
    {
      icone: "💧",
      titulo: "Hidrate-se",
      texto: "Beber água ao longo do dia ajuda no bem-estar e na disposição.",
    },
    {
      icone: "🫀",
      titulo: "Cuide do coração",
      texto: "Rotina, sono e acompanhamento médico fazem diferença no cuidado diário.",
    },
    {
      icone: "🚶",
      titulo: "Movimente-se",
      texto: "Pequenas caminhadas e pausas para alongar ajudam o corpo no dia a dia.",
    },
    {
      icone: "😴",
      titulo: "Valorize o descanso",
      texto: "Dormir bem ajuda na recuperação, no humor e na concentração.",
    },
  ];

  if (isPaciente) {
    return (
      <section className="content-page home-page patient-home-page">
        <div className="patient-welcome-card">
          <span className="patient-welcome-icon">♡</span>
          <div>
            <h1>Bem-vindo(a) à sua área do paciente</h1>
            <p>
              Aqui você encontra seus dados principais, informações sobre a clínica
              e dicas simples para cuidar melhor da saúde no dia a dia.
            </p>
          </div>
        </div>

        <div className="patient-data-panel">
          <div className="patient-data-header">
            <span>👤</span>
            <div>
              <h2>Meus dados</h2>
              <p>Confira suas informações principais cadastradas na clínica.</p>
            </div>
          </div>

          <div className="patient-data-grid">
            <div>
              <strong>Nome</strong>
              <span>{dadosPaciente?.nome || authState?.user?.name || "-"}</span>
            </div>

            <div>
              <strong>CPF</strong>
              <span>{formatarCPF(dadosPaciente?.cpf)}</span>
            </div>

            <div>
              <strong>Telefone</strong>
              <span>{formatarTelefone(dadosPaciente?.telefone)}</span>
            </div>

            <div>
              <strong>E-mail</strong>
              <span>{dadosPaciente?.email || "-"}</span>
            </div>

            <div>
              <strong>Data de nascimento</strong>
              <span>{formatarData(dadosPaciente?.dataNascimento)}</span>
            </div>
          </div>
        </div>

        <div className="patient-consultas-panel">
          <div className="patient-data-header">
            <span>📋</span>
            <div>
              <h2>Minhas consultas</h2>
              <p>Veja os dados da consulta e do médico responsável por cada atendimento.</p>
            </div>
          </div>

          {consultasPaciente.length === 0 ? (
            <p className="empty-message">Nenhuma consulta agendada.</p>
          ) : (
            <div className="patient-consultas-list">
              {consultasPaciente.map((consulta) => (
                <div className="patient-consulta-wrapper" key={consulta.id || consulta.codigo}>
                  <div className="patient-consulta-side-card">
                    <div className="patient-consulta-card-title">
                      <h3>Dados da consulta #{consulta.codigo}</h3>
                      <span>{formatarData(consulta.dataHoraAtendimento)}</span>
                    </div>

                    <div className="patient-consulta-info-grid">
                      <div>
                        <strong>Peso</strong>
                        <span>{consulta.peso || "-"}</span>
                      </div>

                      <div>
                        <strong>Temperatura</strong>
                        <span>{consulta.temperatura || "-"}</span>
                      </div>

                      <div>
                        <strong>Status do pagamento</strong>
                        <span>{formatarStatusPagamento(consulta.statusPagamento)}</span>
                      </div>
                    </div>

                    <div className="patient-consulta-text-block">
                      <strong>Sintomas</strong>
                      <p>{consulta.descricaoSintomas || "-"}</p>
                    </div>

                    <div className="patient-consulta-text-block">
                      <strong>Diagnóstico e tratamento sugerido</strong>
                      <p>{consulta.diagnosticoETratamentoSugerido || "-"}</p>
                    </div>
                  </div>

                  <div className="patient-medico-side-card">
                    <div className="patient-consulta-card-title">
                      <h3>Médico responsável</h3>
                      <span>Atendimento da consulta #{consulta.codigo}</span>
                    </div>

                    <div className="patient-consulta-info-grid">
                      <div>
                        <strong>Nome</strong>
                        <span>{consulta.medicoNome || "-"}</span>
                      </div>

                      <div>
                        <strong>CRM</strong>
                        <span>{consulta.medicoCRM || "-"}</span>
                      </div>

                      <div>
                        <strong>CPF</strong>
                        <span>{formatarCPF(consulta.medicoCPF)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="patient-clinic-panel">
          <div className="patient-clinic-content">
            <span className="patient-clinic-icon">🏥</span>
            <div>
              <h2>Sobre a Cardio Clínica</h2>
              <p>
                A Cardio Clínica foi pensada para oferecer um atendimento
                organizado, acolhedor e focado no cuidado com a saúde. Nosso
                sistema ajuda a equipe a manter cadastros, consultas e
                informações importantes sempre mais acessíveis.
              </p>
            </div>
          </div>
        </div>

        <div className="patient-tips-grid">
          {dicasPaciente.map((dica) => (
            <div className="patient-tip-card" key={dica.titulo}>
              <span>{dica.icone}</span>
              <strong>{dica.titulo}</strong>
              <p>{dica.texto}</p>
            </div>
          ))}
        </div>

        <div className="patient-info-panel">
          <h2>Precisa alterar alguma informação?</h2>
          <p>
            Entre em contato com um funcionário da clínica para atualizar
            cadastro, telefone, e-mail ou dados pessoais.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="content-page home-page">
      <div className="dashboard-grid">
        {cards.filter((card) => podeVer(card.permissoes)).map((card) => (
          <button
            key={card.rota}
            type="button"
            className="dashboard-card dashboard-card-clickable"
            onClick={() => abrirPagina(card.rota, card.permissoes)}
          >
            <h3>{card.titulo}</h3>
            <p>{card.descricao}</p>
          </button>
        ))}
      </div>

      {exibirAvisosEquipe && (
        <div className="staff-notices-panel">
          <div className="staff-notices-header">
            <span className="staff-notices-icon">✦</span>
            <div>
              <h2>Avisos rápidos da equipe</h2>
              <p>Pequenos lembretes para deixar o dia mais leve.</p>
            </div>
          </div>

          <div className="staff-notices-grid">
            {avisosEquipe.map((aviso) => (
              <div className="staff-notice-card" key={aviso.titulo}>
                <span className="staff-notice-emoji">{aviso.icone}</span>
                <div>
                  <strong>{aviso.titulo}</strong>
                  <p>{aviso.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="health-tips-panel">
        <div className="health-tips-header">
          <span className="health-tips-icon">♡</span>
          <div>
            <h2>Dicas rápidas de saúde</h2>
            <p>Pequenos cuidados que ajudam no bem-estar diário.</p>
          </div>
        </div>

        <div className="health-tips-grid">
          {dicasSaude.map((dica) => (
            <div className="health-tip-card" key={dica}>
              {dica}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}