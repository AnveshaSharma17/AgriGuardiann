import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser, getUserProfile, updateUserProfile } from '@/lib/api';
import { logger } from '@/lib/logger';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  location?: string;
  language?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  profile: User | null; // Alias for backward compatibility
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = getCurrentUser();
      if (storedUser) {
        // Verify token is still valid by fetching profile
        const profileData = await getUserProfile();
        // Handle different response formats from API
        const userData = profileData.user || profileData;
        const updatedUser = {
          id: userData.id || userData._id || storedUser.id,
          email: userData.email || storedUser.email,
          name: userData.name || storedUser.name,
          roles: userData.roles || storedUser.roles || [],
          location: userData.location || storedUser.location,
          language: userData.language || storedUser.language,
          profileImage: userData.profileImage || storedUser.profileImage,
        };
        setUser(updatedUser);
        // Also update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      // Token invalid, clear auth
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const data = await apiRegister(email, password, name);

      if (data.access_token && data.user) {
        // Store token and user
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { error: null };
      }

      return { error: new Error('Registration failed') };
    } catch (error: any) {
      logger.error('Sign up error', error);
      return { error: error.response?.data?.error ? new Error(error.response.data.error) : error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await apiLogin(email, password);

      if (data.access_token && data.user) {
        // Store token and user
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { error: null };
      }

      return { error: new Error('Login failed') };
    } catch (error: any) {
      logger.error('Sign in error', error);
      return { error: error.response?.data?.error ? new Error(error.response.data.error) : error };
    }
  };

  const signOut = async () => {
    apiLogout();
    setUser(null);
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const data = await updateUserProfile(updates);

      // Update local user state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { error: null };
    } catch (error: any) {
      logger.error('Error updating profile', error);
      return { error: error.response?.data?.error ? new Error(error.response.data.error) : error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile: user, // Alias for backward compatibility
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
