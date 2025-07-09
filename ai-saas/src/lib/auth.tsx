'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';

interface User {
  username: string;
  email: string;
  name?: string;  // ✅ Optional: only if you return/display the user's name
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, username: string, email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedName = localStorage.getItem('name');  // ✅ Optional

    if (token && storedUsername && storedEmail) {
      setIsAuthenticated(true);
      setUser({ username: storedUsername, email: storedEmail, name: storedName || undefined });
    }
  }, []);

  const login = (token: string, username: string, email: string, name?: string) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    if (name) localStorage.setItem('name', name);  // ✅ Only if provided
    setIsAuthenticated(true);
    setUser({ username, email, name });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('name');  
    localStorage.removeItem('user');

    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
