import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/api';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/AuthContext';

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
  const [deleteItem, setDeleteItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    if (authPermission && !authState?.auth) {
      navigate('/forbidden');
      return;
    }

    if (adminPermission && !authState?.user?.role.includes(1)) {
      navigate('/forbidden');
      return;
    }

    api
      .get(linkGetData)
      .then((res) => setData(res.data.data || []))
      .catch((error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          navigate('/forbidden');
          return;
        }

        console.log(error);
      });
  }, [linkGetData, authState, authPermission, adminPermission, navigate]);

  const handleDelete = (item) => {
    setDeleteItem(item);
  };

  const confirmDelete = () => {
    if (!deleteItem) return;

    api
      .delete(`${linkDelete}/${deleteItem.id}`)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message || 'Cadastro excluído com sucesso!');
          setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
          setDeleteItem(null);
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Não foi possível excluir este cadastro.');
        setDeleteItem(null);
      });
  };

  const onlyNumbers = (value = '') => String(value || '').replace(/\D/g, '');

  const formatValue = (columnName, value) => {
    if (value === null || value === undefined || value === '') return '-';

    const fieldName = String(columnName || '').toLowerCase();
    const stringValue = String(value);

    if (fieldName.includes('cpf')) {
      const digits = onlyNumbers(stringValue);

      if (digits.length === 11) {
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
    }

    if (fieldName.includes('telefone')) {
      const digits = onlyNumbers(stringValue);

      if (digits.length === 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }

      if (digits.length === 11) {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    }

    return stringValue;
  };


  const filteredData = useMemo(() => {
    if (!search.trim()) return data;

    return data.filter((item) =>
      columnsAndNames.some((value) => {
        const dadoColuna = item[value.nameInForm];
        return dadoColuna !== null && dadoColuna !== undefined && String(dadoColuna).toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [data, search, columnsAndNames]);

  return (
    <>
    <section className="content-page list-page">
      <div className="page-title-row">
        <h1 className="page-title">{title.replace('Listagem de ', 'Gestão de ')}</h1>
        <p className="page-help">Use a busca para localizar registros. Clique em um cadastro para visualizar os dados e use os botões de ação quando disponíveis.</p>
      </div>

      <div className="list-toolbar centered-toolbar">
        {useAddNew && (
          <button className="primary-button add-button" onClick={() => navigate(linkNew)}>
            + Adicionar {title.replace('Listagem de ', '').slice(0, -1).toLowerCase()}
          </button>
        )}
      </div>

      <div className="search-wrap">
        <input type="text" name="pesquisa" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar" />
      </div>

      <div className="list-card-stack">
        {filteredData.length > 0 &&
          filteredData.map((item) => (
            <div
              className="person-card person-card-clickable"
              key={item.id}
              onClick={() => setViewItem(item)}
            >
              <div className="avatar-circle">{(item.nome || item.pacienteNome || item.medicoNome || '?').charAt(0).toUpperCase()}</div>
              <div className="person-card-content">
                <div className="person-card-title">{item.nome || item.pacienteNome || item.medicoNome || item.codigo}</div>
                <div className="person-card-meta">
                  {columnsAndNames.slice(1, 4).map((value) => (
                    <span key={`${item.id}-${value.nameInForm}`}>{formatValue(value.column, item[value.nameInForm])}</span>
                  ))}
                </div>
                <div className="person-card-grid">
                  {columnsAndNames.map((value) => (
                    <div key={`${item.id}-${value.nameInForm}-full`}>
                      <strong>{value.column}:</strong> {formatValue(value.column, item[value.nameInForm])}
                    </div>
                  ))}
                </div>
              </div>
              {(useUpdate || useActions) && (
                <div className="person-card-actions">
                  {useUpdate && (
                    <button
                      className="edit-hint-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${linkShow}/${item.id}`);
                      }}
                    >
                      Editar
                    </button>
                  )}
                  {useActions && (
                    <button
                      className="danger-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                    >
                      Excluir
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

        {filteredData.length <= 0 && <p className="empty-message">{emptyMessage}</p>}
      </div>
    </section>


    {viewItem && (
      <div className="view-overlay" role="dialog" aria-modal="true">
        <div className="view-box">
          <div className="view-header">
            <div>
              <span className="view-label">Visualização do cadastro</span>
              <h2>{viewItem.nome || viewItem.pacienteNome || viewItem.medicoNome || viewItem.codigo}</h2>
            </div>
            <button className="view-close-button" onClick={() => setViewItem(null)}>×</button>
          </div>

          <div className="view-grid">
            {columnsAndNames.map((value) => (
              <div className="view-field" key={`view-${viewItem.id}-${value.nameInForm}`}>
                <strong>{value.column}</strong>
                <span>{formatValue(value.column, viewItem[value.nameInForm])}</span>
              </div>
            ))}
          </div>

          <div className="view-actions">
            <button className="secondary-button" onClick={() => setViewItem(null)}>Fechar</button>
          </div>
        </div>
      </div>
    )}

    {deleteItem && (
      <div className="confirm-overlay" role="dialog" aria-modal="true">
        <div className="confirm-box">
          <div className="confirm-icon">?</div>
          <h2>Realmente quer excluir este cadastro?</h2>
          <p>Essa ação vai remover o cadastro de <strong>{deleteItem.nome || deleteItem.pacienteNome || deleteItem.medicoNome || deleteItem.codigo}</strong>.</p>
          <div className="confirm-actions">
            <button className="secondary-button" onClick={() => setDeleteItem(null)}>Cancelar</button>
            <button className="danger-button confirm-danger-button" onClick={confirmDelete}>Sim, excluir</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
