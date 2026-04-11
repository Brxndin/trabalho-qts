import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { useAuth } from "../auth/AuthContext";

// aqui eu decidi fazer uma lista padrão pra não repetir o código tantas vezes
export default function ListLayout({
  title,
  columnsAndNames,
  emptyMessage,
  useActions,
  useAddNew,
  useUpdate,
  linkGetData,
  linkNew,
  linkShow,
  linkDelete,
  authPermission,
  adminPermission,
}) {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (authPermission && !authState?.auth) {
      navigate('/forbidden');
    }

    if (adminPermission && !authState?.user?.role.includes(1)) {
      navigate('/forbidden');
    }

    api
      .get(linkGetData)
      .then((res) => {
        setData((prevState) => {
          return [...prevState, ...res.data.data];
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [linkGetData, authState, authPermission, adminPermission, navigate]);

  const handleDelete = (id) => {
    api
      .delete(`${linkDelete}/${id}`)
      .then((res) => {
        if (res.status == 200) {
          alert(res.data.message);

          setData(data.filter((item) => item.id != id));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // sistema de pesquisa
  const newData = data.filter((item) => {
    let bool = false;

    columnsAndNames.map((value) => {
      bool = bool || (item[value.nameInForm].toLowerCase().includes(search.toLowerCase()));
    })

    return bool;
  });

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <h2 className='text-center'>{title}</h2>
      { useAddNew && (
        <>
          <button
            onClick={() => {
              navigate(linkNew);
            }}
          >
            Cadastrar Novo
          </button>
          <br/>
        </>
      )}
      <br/>
      <input
        type={'text'}
        name={'pesquisa'}
        value={search}
        onChange={handleChange}
        placeholder="Buscar"
      />
      <br/>
      <br/>
      {newData.length > 0 && (
        <table className="list-table">
          <thead className="list-table-header">
            <tr className="list-table-line">
              {columnsAndNames.map((value) => (
                <th className="list-table-cell list-table-header-cell">{value.column}</th>
              ))}
              {useActions && <th className="list-table-cell list-table-header-cell">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {newData.map((item) => (
              <tr
                className="list-table-line"
                key={item.id}
                onClick={() => {
                  if (useUpdate) {
                    navigate(`${linkShow}/${item.id}`);
                  }
                }}
                // aqui é só pra saber que se clicar tem uma ação
                style={useUpdate ? { cursor: "pointer" } : null}
              >
                {columnsAndNames.map((value) => (
                  <td className="list-table-cell">{item[value.nameInForm]}</td>
                ))}

                {useActions && (
                  <td className="list-table-cell">
                    <button
                      onClick={(e) => {
                        // aqui serve pro onclick da linha ser interrompido
                        e.stopPropagation();

                        handleDelete(item.id);
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {newData.length <= 0 && <p>{emptyMessage}</p>}
    </>
  );
}
