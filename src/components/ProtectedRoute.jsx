import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, children }) {
  const token = localStorage.getItem("spendwise_token");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;