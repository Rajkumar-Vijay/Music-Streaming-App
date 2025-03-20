import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  // Register admin
  const register = async (adminData) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Save admin to local storage
      localStorage.setItem('admin', JSON.stringify(data));
      setAdmin(data);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Login admin
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save admin to local storage
      localStorage.setItem('admin', JSON.stringify(data));
      setAdmin(data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout admin
  const logout = () => {
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/admin/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (resetToken, password) => {
    try {
      const response = await fetch(`http://localhost:4000/api/auth/admin/reset-password/${resetToken}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};