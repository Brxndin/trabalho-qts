import { useAuth } from "../auth/AuthContext";
import ListLayout from "../components/ListLayout";

export default function FuncionarioList() {
  const { authState } = useAuth();

  return (
    <div>
      <ListLayout
        title={'Listagem de Funcionários'}
        columnsAndNames={[
          { column: "Nome", nameInForm: "nome" },
          { column: "CPF", nameInForm: "cpf" },
          { column: "Função", nameInForm: "funcao" },
          { column: "Telefone", nameInForm: "telefone" },
          { column: "Endereço", nameInForm: "endereco" },
        ]}
        emptyMessage={"Não há nenhum funcionário cadastrado!"}
        linkShow={"/funcionarios/form"}
        linkDelete={"/funcionarios"}
        linkGetData={"/funcionarios"}
        linkNew={"/funcionarios/form"}
        // aqui define que somente administradores podem cadastrar, editar e excluir
        useAddNew={authState?.user?.role.includes(1)}
        useActions={authState?.user?.role.includes(1)}
        useUpdate={authState?.user?.role.includes(1)}
        authPermission={true}
        adminPermission={false}
      />
    </div>
  );
}
