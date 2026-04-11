import { useAuth } from "../auth/AuthContext";
import ListLayout from "../components/ListLayout";

export default function ConsultaList() {
  const { authState } = useAuth();

  return (
    <div>
      <ListLayout
        title={'Listagem de Consultas'}
        columnsAndNames={[
          { column: "Nome", nameInForm: "nome" },
          { column: "CPF", nameInForm: "cpf" },
          { column: "CRM", nameInForm: "crm" },
          { column: "Telefone", nameInForm: "telefone" },
          { column: "Endereço", nameInForm: "endereco" },
          { column: "E-mail", nameInForm: "email" },
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
