import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../config/api';
import { useAuth } from '../auth/AuthContext';
import Brand from './Brand';

export default function FormLayout({
  title,
  description,
  componentsAndNames,
  submitButtonText,
  linkReturn,
  linkGetData,
  linkStore,
  linkUpdate,
  extraLinks,
  afterSubmitSuccesFunction,
  initialSetDataFunction,
  authPermission,
  createPermission,
  updatePermission,
}) {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [erro, setErro] = useState('');
  const [showPasswords, setShowPasswords] = useState({});
  const { id } = useParams();
  const location = useLocation();
  const { authState, setAuthState } = useAuth();

  const isAuthPage = useMemo(
    () => ['/login', '/recuperar-senha', '/definir-senha'].includes(location.pathname),
    [location.pathname]
  );

  const onlyNumbers = (value = '') => String(value || '').replace(/\D/g, '');

  const separarEndereco = (dados) => {
    if (!dados?.endereco) return dados;

    const enderecoCompleto = String(dados.endereco);
    const partes = enderecoCompleto.split(',').map((parte) => parte.trim());

    const rua = partes[0] || enderecoCompleto;

    const numero = partes
      .find((parte) => parte.toLowerCase().startsWith('nº'))
      ?.replace(/nº/i, '')
      .trim() || '';

    const bairro = partes
      .find((parte) => parte.toLowerCase().startsWith('bairro'))
      ?.replace(/bairro/i, '')
      .trim() || '';

    const cep = partes
      .find((parte) => parte.toLowerCase().startsWith('cep'))
      ?.replace(/cep/i, '')
      .trim() || '';

    return {
      ...dados,
      endereco: rua,
      numero,
      bairro,
      cep,
    };
  };

  useEffect(() => {
    if (authPermission && !authState?.auth) {
      navigate('/forbidden');
      return;
    }

    if (!id && createPermission === false) {
      navigate('/forbidden');
      return;
    }

    if (id && updatePermission === false) {
      navigate('/forbidden');
      return;
    }

    if (linkGetData && id) {
      api
        .get(`${linkGetData}/${id}`)
        .then((res) => {
          setData(separarEndereco(res.data.data));
        })
        .catch((error) => {
          if (error?.response?.status === 401 || error?.response?.status === 403 || error?.response?.status === 404) {
            navigate('/forbidden');
            return;
          }

          console.log(error);
        });
    }

    if (!id && initialSetDataFunction) {
      initialSetDataFunction(api, setData);
    }
  }, [
    id,
    linkGetData,
    authState,
    navigate,
    authPermission,
    createPermission,
    updatePermission,
    initialSetDataFunction,
  ]);

  const normalizePayload = (payload) => {
    const normalized = { ...payload };

    if (
      normalized.endereco !== undefined ||
      normalized.numero !== undefined ||
      normalized.bairro !== undefined ||
      normalized.cep !== undefined
    ) {
      const partesEndereco = [
        normalized.endereco,
        normalized.numero ? `nº ${normalized.numero}` : '',
        normalized.bairro ? `Bairro ${normalized.bairro}` : '',
        normalized.cep ? `CEP ${normalized.cep}` : '',
      ].filter(Boolean);

      normalized.endereco = partesEndereco.join(', ');
      delete normalized.numero;
      delete normalized.bairro;
      delete normalized.cep;
    }

    Object.keys(normalized).forEach((key) => {
      const fieldName = key.toLowerCase();

      if (
        fieldName.includes('cpf') ||
        fieldName.includes('cnpj') ||
        fieldName.includes('telefone') ||
        fieldName.includes('celular')
      ) {
        normalized[key] = onlyNumbers(normalized[key]);
      }
    });

    return normalized;
  };

  const handleLogout = () => {
    setAuthState({
      token: null,
      user: null,
      auth: false,
    });
  };

  const renderSuccessMessage = (message) => {
    const mensagem = message || 'Operação realizada com sucesso!';
    const urlMatch = mensagem.match(/https?:\/\/[^\s]+/);

    if (!urlMatch) return mensagem;

    const url = urlMatch[0];
    const [before, after] = mensagem.split(url);

    return (
      <span>
        {before}
        <a
          href={url}
          onClick={handleLogout}
          style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'underline' }}
        >
          {url}
        </a>
        {after}
      </span>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = normalizePayload(data);
    const action = linkUpdate && id ? api.put(`${linkUpdate}/${id}`, payload) : api.post(linkStore, payload);

    action
      .then((res) => {
        const dadosRetorno = res.data;
        toast.success(renderSuccessMessage(dadosRetorno.message));

        if (afterSubmitSuccesFunction) {
          afterSubmitSuccesFunction(dadosRetorno.data, payload, data);
        }

        if (!id) {
          setData({});
        }
      })
      .catch((error) => {
        const dadosRetorno = error?.response?.data;

        let mensagemErro =
          dadosRetorno?.message ||
          dadosRetorno?.error ||
          error?.message ||
          'Ocorreu um erro ao enviar o formulário.';

        setErro(mensagemErro);
        toast.error(mensagemErro);
      });
  };

  const maskCPF = (value) => onlyNumbers(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  const maskCNPJ = (value) => onlyNumbers(value)
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

  const maskTelefone = (value) => {
    const digits = onlyNumbers(value).slice(0, 11);

    if (digits.length <= 10) {
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
    }

    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  };

  const getFieldMask = (field) => {
    const fieldName = `${field?.name || ''}`.toLowerCase();
    const fieldLabel = `${field?.label || ''}`.toLowerCase();
    const maskType = `${field?.mask || ''}`.toLowerCase();

    if (maskType === 'cpf' || fieldName.includes('cpf') || fieldLabel.includes('cpf')) return maskCPF;
    if (maskType === 'cnpj' || fieldName.includes('cnpj') || fieldLabel.includes('cnpj')) return maskCNPJ;
    if (
      maskType === 'telefone' ||
      fieldName.includes('telefone') ||
      fieldLabel.includes('telefone') ||
      fieldName.includes('celular') ||
      fieldLabel.includes('celular')
    ) return maskTelefone;

    return null;
  };

  const getFieldHelp = (field) => {
    if (field?.help) return field.help;

    const fieldName = `${field?.name || ''}`.toLowerCase();
    const fieldLabel = `${field?.label || ''}`.toLowerCase();

    if (fieldName.includes('cpf') || fieldLabel.includes('cpf')) return 'Documento individual da pessoa. Digite somente os números; a máscara é aplicada automaticamente.';
    if (fieldName.includes('cnpj') || fieldLabel.includes('cnpj')) return 'Documento da empresa. Digite somente os números; a máscara é aplicada automaticamente.';
    if (fieldName.includes('telefone') || fieldLabel.includes('telefone') || fieldName.includes('celular') || fieldLabel.includes('celular')) return 'Número para contato. Pode ser telefone fixo ou celular com DDD.';
    if (fieldName.includes('email') || fieldLabel.includes('e-mail') || fieldLabel.includes('email')) return 'Endereço de e-mail usado para contato e acesso ao sistema.';
    if (fieldName.includes('crm') || fieldLabel.includes('crm')) return 'Registro profissional do médico.';
    if (fieldName.includes('endereco') || fieldLabel.includes('endereço')) return 'Endereço de cadastro do usuário.';
    if (fieldName.includes('numero') || fieldLabel.includes('número') || fieldLabel.includes('numero')) return 'Número do endereço.';
    if (fieldName.includes('bairro') || fieldLabel.includes('bairro')) return 'Bairro do endereço.';
    if (fieldName.includes('cep') || fieldLabel.includes('cep')) return 'CEP do endereço.';
    if (fieldName.includes('nome') || fieldLabel.includes('nome')) return 'Informe o nome completo.';
    if (fieldName.includes('data')) return 'Informe a data no formato solicitado pelo campo.';
    if (fieldName.includes('peso')) return 'Informe o peso do paciente para registro da consulta.';
    if (fieldName.includes('temperatura')) return 'Informe a temperatura medida no atendimento.';
    if (fieldName.includes('statuspagamento')) return 'Situação atual do pagamento da consulta.';
    if (fieldName.includes('funcao') || fieldLabel.includes('função') || fieldLabel.includes('ocupação')) return 'Ocupação registrada no cadastro da pessoa.';

    return 'Preencha este campo conforme a informação solicitada.';
  };

  const handleChange = (e, field) => {
    if (erro) setErro('');

    const mask = getFieldMask(field);
    let value = mask ? mask(e.target.value) : e.target.value;

    if (field.maxLength) {
      value = String(value).slice(0, field.maxLength);
    }

    setData({ ...data, [e.target.name]: value });
  };

  return (
    <div className={isAuthPage ? 'auth-page' : 'content-page'}>
      {isAuthPage && (
        <section className="auth-hero">
          <Brand subtitle />
        </section>
      )}

      <section className={`form-shell ${isAuthPage ? 'form-shell-auth' : ''}`}>
        {!isAuthPage && <div className="section-banner">{title}</div>}

        <div className="card-panel">
          {isAuthPage && (
            <div className="card-heading-block">
              <h2>{title}</h2>
              {description && <p className="card-description">{description}</p>}
            </div>
          )}

          {!isAuthPage && (
            <p className="card-description section-description">
              {description || 'Use esta página para preencher e revisar os dados do cadastro. Passe o mouse sobre o ícone de ajuda (?) ao lado de cada campo para ver a explicação.'}
            </p>
          )}

          {erro && <p className="form-error-message">Erro: {erro}</p>}

          <form onSubmit={handleSubmit} className="clinic-form">
            {componentsAndNames?.map((value) => (
              <div className={`field-group ${value.type === 'textarea' ? 'field-group-full' : ''}`} key={value.name}>
                <div className="field-label-row">
                  <label>{value.label}</label>
                  <span className="field-help" title={getFieldHelp(value)} aria-label={getFieldHelp(value)}>?</span>
                </div>

                {['text', 'email', 'password', 'datetime-local', 'date'].includes(value.type) && (
                  value.type === 'password' ? (
                    <div className="password-field">
                      <input
                        type={showPasswords[value.name] ? 'text' : 'password'}
                        name={value.name}
                        value={data[value.name] || value.value || ''}
                        placeholder={value?.placeholder || ''}
                        onChange={(e) => handleChange(e, value)}
                        required={value.required || false}
                        disabled={value.disabled || false}
                        readOnly={value.readOnly || false}
                        maxLength={value.maxLength || undefined}
                        onBlur={value.onBlur ? (() => value.onBlur(api, setData, data[value.name])) : undefined}
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            [value.name]: !prev[value.name],
                          }))
                        }
                        aria-label={showPasswords[value.name] ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPasswords[value.name] ? '🙈' : '👁️'}
                      </button>
                    </div>
                  ) : (
                    <input
                      type={value.type}
                      name={value.name}
                      value={data[value.name] || value.value || ''}
                      placeholder={value?.placeholder || ''}
                      onChange={(e) => handleChange(e, value)}
                      required={value.required || false}
                      disabled={value.disabled || false}
                      readOnly={value.readOnly || false}
                      maxLength={value.maxLength || undefined}
                      onBlur={value.onBlur ? (() => value.onBlur(api, setData, data[value.name])) : undefined}
                    />
                  )
                )}

                {value.type === 'textarea' && (
                  <textarea
                    name={value.name}
                    value={data[value.name] || value.value || ''}
                    placeholder={value?.placeholder || ''}
                    onChange={(e) => handleChange(e, value)}
                    required={value.required || false}
                    disabled={value.disabled || false}
                    readOnly={value.readOnly || false}
                    maxLength={value.maxLength || undefined}
                    onBlur={value.onBlur ? (() => value.onBlur(api, setData, data[value.name])) : undefined}
                  />
                )}

                {value.type === 'select' && (
                  <select
                    name={value.name}
                    value={data[value.name] || value.value || ''}
                    onChange={(e) => handleChange(e, value)}
                    required={value.required || false}
                    disabled={value.disabled || false}
                  >
                    <option value="">Selecione</option>
                    {value.options.map((option) => (
                      <option value={option.value} key={`${value.name}-${option.value}`}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            {extraLinks?.length > 0 && (
              <div className="extra-links">
                {extraLinks.map((value) => (
                  <p onClick={() => navigate(value.href)} className="form-link" key={value.href}>
                    {value.text}
                  </p>
                ))}
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="primary-button full-width-button">
                {submitButtonText}
              </button>

              {linkReturn && (
                <button
                  className="secondary-button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(linkReturn);
                  }}
                >
                  Voltar
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}