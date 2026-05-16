import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, MOCK_USERS, Teacher, MOCK_TEACHERS } from '../data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: { email?: string; password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password?: string) => {
    // Check main admins (mocked)
    // For now we use the hardcoded admin, but we should also check localStorage for updated admin
    const adminData = localStorage.getItem('admin_credentials');
    const adminCreds = adminData ? JSON.parse(adminData) : { email: 'admin@emit.mg', password: 'admin' };

    if (email === adminCreds.email && password === adminCreds.password) {
      const admin: User = {
        id: '1',
        name: 'Administrateur',
        email: adminCreds.email,
        role: UserRole.ADMIN
      };
      setUser(admin);
      localStorage.setItem('user', JSON.stringify(admin));
      return;
    }

    // Check Teachers from localStorage or MOCK_TEACHERS
    const teachersData = localStorage.getItem('teachers');
    const teachers: Teacher[] = teachersData ? JSON.parse(teachersData) : MOCK_TEACHERS;
    
    const teacherAccount = teachers.find(t => t.email === email);
    
    if (teacherAccount) {
      // If no password set in legacy data, allow 'password123'
      const validPassword = teacherAccount.password || 'password123';
      
      if (validPassword === password) {
        const teacherUser: User = {
          id: teacherAccount.id,
          name: teacherAccount.name,
          email: teacherAccount.email,
          role: UserRole.TEACHER
        };
        setUser(teacherUser);
        localStorage.setItem('user', JSON.stringify(teacherUser));
      } else {
        throw new Error('Mot de passe incorrect.');
      }
    } else {
      throw new Error('Identifiants non reconnus.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = async (updates: { email?: string; password?: string }) => {
    if (!user) return;

    if (user.role === UserRole.ADMIN) {
      const adminData = localStorage.getItem('admin_credentials');
      const adminCreds = adminData ? JSON.parse(adminData) : { email: 'admin@emit.mg', password: 'admin' };
      
      const newCreds = { ...adminCreds, ...updates };
      localStorage.setItem('admin_credentials', JSON.stringify(newCreds));
      
      // Update current user state if email changed
      if (updates.email) {
        const updatedUser = { ...user, email: updates.email };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } else {
      // Handle teacher updates if needed, though request said only admin
      const teachersData = localStorage.getItem('teachers');
      let teachers: Teacher[] = teachersData ? JSON.parse(teachersData) : MOCK_TEACHERS;
      
      teachers = teachers.map(t => t.id === user.id ? { ...t, ...updates } : t);
      localStorage.setItem('teachers', JSON.stringify(teachers));
      
      if (updates.email) {
        const updatedUser = { ...user, email: updates.email };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
