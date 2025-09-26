// contexts/AuthContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    permissions: string[];
    isAuthenticated: boolean;
    can: (permission: string, resource?: any) => boolean;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
    user: User | null;
    permissions: string[];
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
    children,
    user,
    permissions
}) => {
    const isAuthenticated = !!user;

    const hasRole = (role: string): boolean => {
        return user?.role === role;
    };

    const can = (permission: string, resource?: any): boolean => {
        // Admin a tous les droits
        if (user?.role === 'ROLE_ADMIN') return true;

        // Vérification des permissions spécifiques
        if (permissions.includes(permission)) return true;

        // Vérification de la propriété sur la ressource
        if (resource && resource.user_id === user?.id) return true;

        return false;
    };

    const value: AuthContextType = {
        user,
        permissions,
        isAuthenticated,
        can,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};