import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // If user not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise allow component to render
  return children;
}
