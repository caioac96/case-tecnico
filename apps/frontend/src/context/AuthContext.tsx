import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/backend";

interface User {
    id: string;
    register: string;
    name?: string;
    password?: string;
    admin?: boolean;
}

type RegisterData = {
    name: string;
    password: string;
};

export interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (register: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAccess = localStorage.getItem("accessToken");
        const storedRefresh = localStorage.getItem("refreshToken");
        const storedUser = localStorage.getItem("user");

        if (storedAccess && storedUser) {
            setAccessToken(storedAccess);
            setUser(JSON.parse(storedUser));
            api.defaults.headers.common["Authorization"] = `Bearer ${storedAccess}`;
        }
        if (storedRefresh) setRefreshToken(storedRefresh);

        setLoading(false);
    }, []);

    const login = async (register: string, password: string) => {
        try {
            const res = await api.post("/auth/login", { register, password });
            const { user, accessToken, refreshToken } = res.data;

            setUser(user);
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

            return { success: true, message: user.name };
        } catch (err: any) {
            const msg = err.response?.data?.message || "Falha ao autenticar";
            return { success: false, message: msg };
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error("Erro ao deslogar:", err);
        }
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        delete api.defaults.headers.common["Authorization"];
        navigate("/login");
    };

    const refreshAccessToken = async (): Promise<string | null> => {
        try {
            const storedRefresh = refreshToken || localStorage.getItem("refreshToken");
            if (!storedRefresh) {
                logout();
                return null;
            }

            const res = await api.post("/auth/refresh", { refreshToken: storedRefresh });
            const { accessToken: newAccessToken } = res.data;

            setAccessToken(newAccessToken);
            localStorage.setItem("accessToken", newAccessToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

            return newAccessToken;
        } catch (err) {
            console.error("Erro ao renovar token:", err);
            logout();
            return null;
        }
    };

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (
                    error.response?.status === 401 &&
                    !originalRequest._retry &&
                    error.response.data?.message?.includes("jwt expired")
                ) {
                    originalRequest._retry = true;
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalRequest);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [refreshToken]);

    useEffect(() => {
        if (!accessToken) return;
        const interval = setInterval(() => refreshAccessToken(), 14 * 60 * 1000); // 14 minutos
        return () => clearInterval(interval);
    }, [accessToken]);

    const register = async (data: RegisterData) => {
        try {
            const response = await api.post("/auth/register", data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message };
        }
    };

    const value: AuthContextType = {
        user,
        accessToken,
        loading,
        login,
        logout,
        register,
    };

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    return ctx;
};