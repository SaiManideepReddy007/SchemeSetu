import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function getInitialState() {
  try {
    const token = localStorage.getItem('schemesetu_token');
    const userStr = localStorage.getItem('schemesetu_user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return { user, token };
    }
  } catch {
    localStorage.removeItem('schemesetu_token');
    localStorage.removeItem('schemesetu_user');
  }
  return { user: null, token: null };
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialState);

  const login = (userData, authToken) => {
    if (userData && authToken) {
      localStorage.setItem('schemesetu_token', authToken);
      localStorage.setItem('schemesetu_user', JSON.stringify(userData));
      setAuthState({ user: userData, token: authToken });
    }
  };

  const logout = () => {
    localStorage.removeItem('schemesetu_token');
    localStorage.removeItem('schemesetu_user');
    setAuthState({ user: null, token: null });
  };

  const updateUser = (updatedFields) => {
    setAuthState((current) => {
      if (!current.user) return current;
      const newUser = { ...current.user, ...updatedFields };
      localStorage.setItem('schemesetu_user', JSON.stringify(newUser));
      return { ...current, user: newUser };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        login,
        logout,
        updateUser,
        loading: false,
        isLoggedIn: !!authState.token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}