import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // Wait for auth to load from localStorage
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise allow component to render
  return children;
}
