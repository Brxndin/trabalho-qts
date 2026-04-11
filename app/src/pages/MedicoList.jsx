import { useAuth } from "../auth/AuthContext";
import ListLayout from "../components/ListLayout";

export default function MedicoList() {
  const { authState } = useAuth();

  return (
    <div>
      <ListLayout
        title={'Listagem de Médicos'}
        columnsAndNames={[
          { column: "Nome", nameInForm: "nome" },
          { column: "CPF", nameInForm: "cpf" },
          { column: "CRM", nameInForm: "crm" },
          { column: "Telefone", nameInForm: "telefone" },
          { column: "Endereço", nameInForm: "endereco" },
        ]}
        emptyMessage={"Não há nenhum médico cadastrado!"}
        linkShow={"/medicos/form"}
        linkDelete={"/medicos"}
        linkGetData={"/medicos"}
        linkNew={"/medicos/form"}
        // aqui define que somente funcionários podem cadastrar, editar e excluir
        useAddNew={authState?.user?.role.includes(4)}
        useActions={authState?.user?.role.includes(4)}
        useUpdate={authState?.user?.role.includes(4)}
        authPermission={true}
        adminPermission={false}
      />
    </div>
  );
}
