import { useAuth } from "../auth/AuthContext";
import ListLayout from "../components/ListLayout";

export default function UsuarioList() {
  const { authState } = useAuth();

  return (
    <div>
      <ListLayout
        title={'Listagem de Usuários'}
        columnsAndNames={[
          { column: "Nome", nameInForm: "nome" },
          { column: "E-mail", nameInForm: "email" },
          { column: "Tipo", nameInForm: "tipo" },
        ]}
        emptyMessage={"Não há nenhum usuário cadastrado!"}
        linkShow={"/users/form"}
        linkDelete={"/users"}
        linkGetData={"/users"}
        linkNew={"/users/form"}
        // aqui define que somente administradores podem cadastrar, atualizar e excluir
        useAddNew={authState?.user?.role.includes(1)}
        useActions={authState?.user?.role.includes(1)}
        useUpdate={authState?.user?.role.includes(1)}
        authPermission={true}
        adminPermission={false}
      />
    </div>
  );
}
