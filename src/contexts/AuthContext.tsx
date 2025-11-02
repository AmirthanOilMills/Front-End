import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Admin } from '../types';
import { mockAdmins } from '../data/mockData';

interface AuthContextType {
  currentAdmin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
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
    <AuthContext.Provider value={{
      currentAdmin,
      login,
      logout,
      isAuthenticated: !!currentAdmin
    }}>
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