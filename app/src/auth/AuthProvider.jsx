import { useState } from 'react';
import { AuthContext } from './AuthContext';

// o auth é usado em formato de context e provider
// isso porque precisa ser usado em todo sistema e o localStorage não é reativo
// aqui garante que os dois (storage e state) sejam atualizados juntos e tenham os mesmos dados
export function AuthProvider({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const auth = localStorage.getItem('auth');

  const [authState, setAuthState] = useState({
    token: token,
    user: JSON.parse(user),
    auth: auth,
  });
  
  const updateAuthState = ({ token, user, auth }) => {
    if (!auth) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth');
    } else {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('auth', auth);
    }

    setAuthState({
        token: token,
        user: user,
        auth: auth,
    });
  };

  const value = { authState, setAuthState: updateAuthState };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}