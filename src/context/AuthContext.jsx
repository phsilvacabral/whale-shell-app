import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token JWT
    const token = localStorage.getItem('token');
    if (token) {
      // Validar token e carregar usuário
      authService.getCurrentUser()
        .then(userData => setUser(userData))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      // Verificar se está usando modo anônimo
      const anonymousData = localStorage.getItem('anonymous_mode');
      if (anonymousData) {
        setIsAnonymous(true);
        setUser({ name: 'Usuário Anônimo' });
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { user: userData, token } = await authService.login(email, password);
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAnonymous(false);
  };

  const register = async (name, email, password) => {
    const { user: userData, token } = await authService.register(name, email, password);
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAnonymous(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAnonymous(false);
  };

  const startAnonymous = () => {
    localStorage.setItem('anonymous_mode', 'true');
    setIsAnonymous(true);
    setUser({ name: 'Usuário Anônimo' });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAnonymous, 
      loading, 
      login, 
      register, 
      logout, 
      startAnonymous 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
