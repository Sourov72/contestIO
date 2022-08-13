import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

// receives component and any other props represented by ...rest
export const ProtectedRoutes = ({ redirectPath: redirectPath, children }) => {
  // get cookie from browser if logged in
  const token = cookies.get("TOKEN");
  // returns route if there is a valid token set in the cookie
  if (!token) {
    return (
        <Navigate to={redirectPath} replace />
    );
  }
  return children ? children : <Outlet />;
};
