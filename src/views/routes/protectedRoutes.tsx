import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = useSelector((store: any) => store.auth.token);

  const isAuthenticated = () => {
    if (token) {
      return true;
    } else {
      return false;
    }
  };

  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
