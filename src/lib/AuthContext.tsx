import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, MOCK_USERS, Teacher, MOCK_TEACHERS } from '../data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password?: string) => {
    // Check main admins (mocked)
    if (email === 'admin@emit.mg' && password === 'admin') {
      const admin = MOCK_USERS.find(u => u.email === email);
      if (admin) {
        setUser(admin);
        localStorage.setItem('user', JSON.stringify(admin));
        return;
      }
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

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
