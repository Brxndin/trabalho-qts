import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/api";
import { useAuth } from "../auth/AuthContext";

// aqui eu decidi fazer um form padrão pra não repetir o código tantas vezes
export default function FormLayout({
  title,
  componentsAndNames,
  submitButtonText,
  linkReturn,
  linkGetData,
  linkStore,
  linkUpdate,
  afterSubmitSuccesFunction,
  authPermission,
  createPermission,
  updatePermission,
}) {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [erro, setErro] = useState("");
  const { id } = useParams();
  const { authState } = useAuth();

  useEffect(() => {
    if (authPermission && !authState?.auth) {
      navigate("/forbidden");
    }

    if (!id && !createPermission) {
      navigate("/forbidden");
    }

    if (id && !updatePermission) {
      navigate("/forbidden");
    }

    if (linkGetData && id) {
      api
        .get(`${linkGetData}/${id}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [
    id,
    linkGetData,
    authState,
    navigate,
    authPermission,
    adminCreatePermission,
    funcionarioCreatePermission,
    medicoCreatePermission,
    adminUpdatePermission,
    funcionarioUpdatePermission,
    medicoUpdatePermission,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (linkUpdate && id) {
      api
        .put(`${linkUpdate}/${id}`, data)
        .then((res) => {
          let dadosRetorno = res.data;

          alert(dadosRetorno.message);

          if (afterSubmitSuccesFunction) {
            afterSubmitSuccesFunction(dadosRetorno);
          }
        })
        .catch((error) => {
          let dadosRetorno = error.response.data;

          setErro(dadosRetorno.message);
        });
    } else if (linkStore) {
      api
        .post(linkStore, data)
        .then((res) => {
          let dadosRetorno = res.data;

          alert(dadosRetorno.message);

          if (afterSubmitSuccesFunction) {
            afterSubmitSuccesFunction(dadosRetorno);
          }

          setData({});
        })
        .catch((error) => {
          let dadosRetorno = error.response.data;

          setErro(dadosRetorno.message);
        });
    }
  };

  const handleChange = (e) => {
    if (erro) {
      setErro("");
    }

    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h2>{title}</h2>
      {erro && <p id="form-error-message">Erro: {erro}</p>}
      <form onSubmit={handleSubmit}>
        {componentsAndNames.map((value) => {
          return (
            <div>
              <label>{value.label}</label>
              {["text", "email", "password", "datetime-local"].includes(
                value.type,
              ) && (
                <input
                  type={value.type}
                  name={value.name}
                  value={data[value.name] || ""}
                  placeholder={value?.placeholder || ""}
                  onChange={handleChange}
                  required={value.required || false}
                />
              )}
              {value.type == "textarea" && (
                <textarea
                  name={value.name}
                  value={data[value.name] || ""}
                  placeholder={value?.placeholder || ""}
                  onChange={handleChange}
                  required={value.required || false}
                />
              )}
              {value.type == "select" && (
                <select
                  name={value.name}
                  value={data[value.name] || ""}
                  onChange={handleChange}
                  required={value.required || false}
                >
                  <option value={null}>Selecione</option>
                  {value.options.map((option) => {
                    return <option value={option.value}>{option.text}</option>;
                  })}
                </select>
              )}
            </div>
          );
        })}
        <button type="submit" id="form-submit-button">
          {submitButtonText}
        </button>
        {linkReturn && (
          <button
            onClick={(e) => {
              e.preventDefault();

              navigate(linkReturn);
            }}
          >
            Voltar
          </button>
        )}
      </form>
    </>
  );
}
