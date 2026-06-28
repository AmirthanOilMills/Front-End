import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await getCurrentUser();
          if (res?.status && res?.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem("token");
          }
        } catch (err) {
          console.error("Failed to restore session:", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const setLogin = (newUser) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
