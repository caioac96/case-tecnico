import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <p>Carregando...</p>;

    return user ? <>{children}</> : <Navigate to="/login" replace />;
};