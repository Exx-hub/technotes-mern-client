import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function ProtectedRoutes({ allowedRoles }) {
  const location = useLocation();
  const { roles } = useAuth();

  const content = roles.some((roles) => allowedRoles.includes(roles)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );

  return content;
}

export default ProtectedRoutes;
