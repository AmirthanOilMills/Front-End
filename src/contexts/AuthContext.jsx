import React, { createContext, useContext, useState } from 'react';
import { mockAdmins } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);

  const login = async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const admin = mockAdmins.find(a => a.email === email && a.password === password);

    if (admin) {
      setCurrentAdmin(admin);
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentAdmin,
        login,
        logout,
        isAuthenticated: !!currentAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
