import { jest, describe, expect,it, beforeEach } from '@jest/globals';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../../modules/auth/AuthContext';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { ReactNode } from 'react';

// Properly type the mocked axios
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const TestComponent = ({ action }: { action: string }) => {
  const auth = useAuth();

  const handleLogin = async () => {
    try {
      await auth.login('test@example.com', 'password');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignUp = async () => {
    try {
      await auth.signUp('John', 'Doe', 'test@example.com', 'password');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div>
      {action === 'login' && <button onClick={handleLogin}>Login</button>}
      {action === 'signup' && <button onClick={handleSignUp}>Sign Up</button>}
      {action === 'logout' && <button onClick={handleLogout}>Logout</button>}
      {auth.loading && <div>Loading...</div>}
      {auth.error && <div>{auth.error}</div>}
      {auth.currentUser && <div>User: {auth.currentUser.email}</div>}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('AuthProvider', () => {
    it('renders children and provides context', () => {
      render(
        <MemoryRouter>
          <AuthProvider>
            <div>Test Child</div>
          </AuthProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
  });

  describe('useAuth', () => {
    it('throws error when used outside AuthProvider', () => {
      // Prevent console error from showing in test output
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => render(<TestComponent action="login" />)).toThrow(
        'useAuth must be used within an AuthProvider'
      );

      console.error = originalError;
    });
  });

  describe('login', () => {
    it('successfully logs in a user', async () => {
      const mockUser = {
        _id: '123',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };

      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            user: mockUser,
            token: 'fake-token',
          },
        },
      });

      render(
        <MemoryRouter>
          <AuthProvider>
            <TestComponent action="login" />
          </AuthProvider>
        </MemoryRouter>
      );

      await act(async () => {
        screen.getByText('Login').click();
      });

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/auth/sign-in'),
          { email: 'test@example.com', password: 'password' }
        );
        expect(localStorage.getItem('token')).toBe('fake-token');
        expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
      });
    });

    it('handles login failure', async () => {
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Login failed'));

      render(
        <MemoryRouter>
          <AuthProvider>
            <TestComponent action="login" />
          </AuthProvider>
        </MemoryRouter>
      );

      await act(async () => {
        screen.getByText('Login').click();
      });

      await waitFor(() => {
        expect(screen.getByText('Login failed. Please check your credentials.')).toBeInTheDocument();
      });
    });
  });

  describe('signUp', () => {
    it('successfully signs up and logs in a user', async () => {
      const mockUser = {
        _id: '123',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };

      (axios.post as jest.Mock)
        .mockResolvedValueOnce({
          data: { success: true },
        })
        .mockResolvedValueOnce({
          data: {
            success: true,
            data: {
              user: mockUser,
              token: 'fake-token',
            },
          },
        });

      render(
        <MemoryRouter>
          <AuthProvider>
            <TestComponent action="signup" />
          </AuthProvider>
        </MemoryRouter>
      );

      await act(async () => {
        screen.getByText('Sign Up').click();
      });

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/auth/sign-up'),
          { firstName: 'John', lastName: 'Doe', email: 'test@example.com', password: 'password' }
        );
        expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
      });
    });

    it('handles signup failure', async () => {
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Signup failed'));

      render(
        <MemoryRouter>
          <AuthProvider>
            <TestComponent action="signup" />
          </AuthProvider>
        </MemoryRouter>
      );

      await act(async () => {
        screen.getByText('Sign Up').click();
      });

      await waitFor(() => {
        expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
      });
    });

    it('handles auto-login failure after signup', async () => {
      (axios.post as jest.Mock)
        .mockResolvedValueOnce({
          data: { success: true },
        })
        .mockRejectedValueOnce(new Error('Login failed'));

      render(
        <MemoryRouter>
          <AuthProvider>
            <TestComponent action="signup" />
          </AuthProvider>
        </MemoryRouter>
      );

      await act(async () => {
        screen.getByText('Sign Up').click();
      });

      await waitFor(() => {
        expect(screen.getByText('Account created but auto-login failed. Please sign in manually.')).toBeInTheDocument();
      });
    });
  });

  describe('logout', () => {
    it('successfully logs out a user', async () => {
      const mockUser = {
        _id: '123',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };

      // First login to set user
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            user: mockUser,
            token: 'fake-token',
          },
        },
      });

      render(
        <MemoryRouter>
          <AuthProvider>
            <TestComponent action="login" />
          </AuthProvider>
        </MemoryRouter>
      );

      await act(async () => {
        screen.getByText('Login').click();
      });

      await waitFor(() => {
        expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
      });

      // Now test logout
      await act(async () => {
        screen.getByText('Logout').click();
      });

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBeNull();
        expect(screen.queryByText(`User: ${mockUser.email}`)).not.toBeInTheDocument();
      });
    });
  });
});