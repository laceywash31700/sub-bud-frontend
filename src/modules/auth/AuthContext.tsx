import { createContext, useContext, useState, ReactNode } from 'react';
import { API_URL } from '@/config/env';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}


// Create context with default value
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();




  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/sign-in`, { email, password });
      if (response.data.success) {
        console.log(response.data);
        setCurrentUser(response.data.data.user);
        localStorage.setItem('token', response.data.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };


const signUp = async(firstName: string, lastName: string, email: string, password: string) => {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/sign-up`, { firstName, lastName, email, password });
    if (response.data.success) {
      try {
        await login(email, password);
      } catch (loginErr) {
        setError('Account created but auto-login failed. Please sign in manually.');
      }
    }
  } catch (err) {
    setError('Registration failed. Please try again.');
    throw err;
  } finally {
    setLoading(false);
  }
}

  const logout = () => {
    setCurrentUser(null);;
    localStorage.removeItem('token');
    navigate('/sign-in');
  };

  const value = {
    currentUser,
    signUp,
    login,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context
}