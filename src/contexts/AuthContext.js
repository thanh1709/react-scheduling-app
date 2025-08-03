import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('token');
        const roles = localStorage.getItem('roles');
        if (token && roles) {
            return { token, roles: JSON.parse(roles) };
        }
        return null;
    });

    const login = (token, roles) => {
        localStorage.setItem('token', token);
        localStorage.setItem('roles', JSON.stringify(roles));
        setAuth({ token, roles });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        setAuth(null);
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
