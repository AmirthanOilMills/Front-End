import React from "react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./api/auth";
import { useAuth } from "./contexts/AuthContext";
const ProtectedRoute = ({ children }) => {
  const { user, setLogin } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getCurrentUser();   // 🍪 auto-sent by browser
        if (res?.status) {
          setLogin(res.user);                // ✅ Store in AuthContext
        }
      } catch (err) {
        console.log("User not logged in");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  // After loading, if user still not available → redirect
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
