import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '../services/auth/AuthService';

export interface User {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  // Ajoute d'autres champs si besoin
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  editProfile: (data: { name?: string; email?: string }) => Promise<void>;
  showProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const profile = await AuthService.showProfile(token) as User;
        setUser(profile);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await AuthService.login(email, password) as { token: string; user: User };
    await AsyncStorage.setItem('token', token);
    setUser(user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    const { token, user } = await AuthService.register(data) as { token: string; user: User };
    await AsyncStorage.setItem('token', token);
    setUser(user);
  };

  const forgotPassword = async (email: string) => {
    await AuthService.forgotPassword(email);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    await AuthService.changePassword(oldPassword, newPassword);
  };

  const editProfile = async (data: { name?: string; email?: string }) => {
    const updated = await AuthService.editProfile(data) as User;
    setUser(updated);
  };

  const showProfile = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const profile = await AuthService.showProfile(token) as User;
      setUser(profile);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, forgotPassword, changePassword, editProfile, showProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 