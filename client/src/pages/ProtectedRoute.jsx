import React from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "./dashboard/DashboardLayout";

const ProtectedRoute = ({ userData }) => {
  return userData ? <Dashboard /> : <Navigate to={"/dashboard"} />;
};

export default ProtectedRoute;
