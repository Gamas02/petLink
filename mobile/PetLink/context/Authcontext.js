import React, { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // ✅ Parâmetro era "email" mas o backend e as telas usam "usuario"
    async function login(usuario, senha) {
        try {
            const response = await api.post("/login", { usuario, senha });
            // ✅ Só salva dados do usuário, NUNCA a senha
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            // ✅ Retorna o erro para a tela tratar e exibir mensagem
            const message =
                error.response?.data?.message || "Erro ao fazer login. Tente novamente.";
            return { success: false, message };
        }
    }

    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                signed: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}