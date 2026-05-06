import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import FormLayout from '../components/FormLayout';

export default function Login() {
  const navigate = useNavigate();
  const { authState, setAuthState } = useAuth();

  useEffect(() => {
    if (authState?.auth) navigate('/');
  }, [authState, navigate]);

  return (
    <FormLayout
      title="Login"
      componentsAndNames={[
        { label: 'Email', name: 'email', type: 'email', placeholder: 'seu@email.com', required: true },
        { label: 'Senha', name: 'senha', type: 'password', placeholder: 'Digite sua senha', required: true },
      ]}
      submitButtonText="Acessar Sistema"
      linkStore="/auth/login"
      extraLinks={[{ href: '/recuperar-senha', text: 'Esqueci minha senha' }]}
      afterSubmitSuccesFunction={(dadosRetorno) => {
        setAuthState({
          token: dadosRetorno.token,
          user: dadosRetorno.user,
          auth: dadosRetorno.auth,
        });

        navigate('/');
      }}
      updatePermission={true}
      createPermission={true}
    />
  );
}