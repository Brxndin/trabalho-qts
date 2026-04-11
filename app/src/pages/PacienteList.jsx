import { useAuth } from "../auth/AuthContext";
import ListLayout from "../components/ListLayout";

export default function PacienteList() {
  const { authState } = useAuth();

  return (
    <div>
      <ListLayout
        title={'Listagem de Pacientes'}
        columnsAndNames={[
          { column: "Nome", nameInForm: "nome" },
          { column: "CPF", nameInForm: "cpf" },
          { column: "Telefone", nameInForm: "telefone" },
          { column: "Data de Nascimento", nameInForm: "dataNascimento" },
        ]}
        emptyMessage={"Não há nenhum paciente cadastrado!"}
        linkShow={"/pacientes/form"}
        linkDelete={"/pacientes"}
        linkGetData={"/pacientes"}
        linkNew={"/pacientes/form"}
        // aqui define que somente funcionários podem cadastrar e editar
        useAddNew={authState?.user?.role.includes(4)}
        useActions={false}
        useUpdate={authState?.user?.role.includes(4)}
        authPermission={true}
        adminPermission={false}
      />
    </div>
  );
}
