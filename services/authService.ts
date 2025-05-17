import api from '@/lib/api';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

// Constants
const USER_STORAGE_KEY = 'eduSphereUser';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Interfaces
interface TokenData {
  refresh: string;
  access: string;
}

interface UserData {
  id: string;
  email: string;
  app_level_role: string;
  is_active: boolean;
  [key: string]: any;
}

interface LoginResponse {
  status: boolean;
  message: string;
  detail: string;
  data: {
    tokens: TokenData;
    user: UserData;
  };
}

interface RegisterData {
  email: string;
  password: string;
  [key: string]: any;
}

interface StoredUserData {
  tokens: TokenData;
  user: UserData;
  role?: string;
  timestamp?: number;
}

// Helper functions
const getUserFromStorage = (): StoredUserData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookieStr = Cookies.get('userData');

    if (cookieStr) {
      return JSON.parse(cookieStr);
    }
  } catch (error) {
    console.error('Error parsing user data from cookies:', error);
  }
  
  return null;
};

const saveUserData = (userData: StoredUserData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Save to localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    
    // Save to cookies as backup
    Cookies.set('userData', JSON.stringify(userData), { expires: 7, secure: true });
    
    // Set session flag
    sessionStorage.setItem('isLoggedIn', 'true');
    
    console.log('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

const clearUserData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    Cookies.remove('userData');
    sessionStorage.removeItem('isLoggedIn');
    console.log('User data cleared successfully');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

// Create a clean axios instance for direct API calls
const directApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<UserData & { role: string }> => {
    try {
      console.log('Attempting login for:', email);
      const response = await api.post<LoginResponse>('/auth/login/', { email, password });
      
      console.log('Login response:', response.data);
      
      const { tokens, user } = response.data.data;
      
      // Create timestamp for token storage
      const tokenTimestamp = Date.now();
      
      // Store the tokens and user data with timestamp
      const userData: StoredUserData = { 
        tokens,
        user,
        role: user.app_level_role,
        timestamp: tokenTimestamp
      };
      
      // Save user data to storage
      saveUserData(userData);
      
      // Add a delay to ensure storage is complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return the user data with role
      return { ...user, role: user.app_level_role };
    } catch (error) {
      console.error('Login error', error);
      const err = error as AxiosError<any>;
      const message = err.response?.data?.detail || 'Failed to sign in';
      toast.error(message);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      const userData = getUserFromStorage();
      if (userData?.tokens?.refresh) {
        await api.post('/auth/logout/', { refresh: userData.tokens.refresh });
      }
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      clearUserData();
    }
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterData): Promise<any> => {
    try {
      const response = await api.post('/auth/register/', userData);
      toast.success('Registration successful');
      return response.data;
    } catch (error) {
      const err = error as AxiosError<any>;
      const message = err.response?.data?.detail || 'Registration failed';
      toast.error(message);
      throw error;
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<any> => {
    try {
      console.log('Starting getProfile request');
      
      const isAuth = authService.isAuthenticated();
      console.log('Is authenticated:', isAuth);
      
      if (!isAuth) {
        throw new Error('User is not authenticated');
      }
      
      const accessToken = authService.getAccessToken();
      console.log('Access token available:', !!accessToken);
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
  
      const headers = {
        'Authorization': `Bearer ${accessToken}`
      };
  
      console.log(`Making API request to ${API_BASE_URL}/account/profile/`);
      const response = await api.get('/auth/profile/', {
        headers
      });
      
      console.log('Profile request successful:', response.status);
      return response;
    } catch (error) {
      console.error('Profile fetch error:', error);
      if (axios.isAxiosError(error)) {
        console.log('Error response:', error.response?.data);
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('Authentication error, clearing user data');
          clearUserData();
          
          // Redirect to login if unauthorized
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: any): Promise<any> => {
    try {
      const accessToken = authService.getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
      
      const response = await api.put('/auth/profile/', profileData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  /**
   * Change user password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<any> => {
    try {
      const accessToken = authService.getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
      
      const response = await api.post('/auth/change-password/', {
        current_password: currentPassword,
        new_password: newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  },

  /**
   * Delete user account
   */
  deleteAccount: async (password: string): Promise<void> => {
    try {
      console.log('Starting account deletion process');
      
      const isAuth = authService.isAuthenticated();
      if (!isAuth) {
        throw new Error('User is not authenticated');
      }
      
      const accessToken = authService.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }
      
      // Make deletion request with password confirmation
      const response = await api.delete('/auth/profile', {
        data: { password },
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      toast.success('Account deleted successfully');
      
      // Clear user data after successful deletion
      clearUserData();
      
      // Force redirect to homepage or login page after deletion
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      return response.data;
    } catch (error) {
      console.error('Account deletion error:', error);
      
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<any>;
        const message = err.response?.data?.detail || 'Failed to delete account';
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred');
      }
      
      throw error;
    }
  },

  /**
   * Upload profile image
   */
  uploadProfileImage: async (file: File): Promise<any> => {
    try {
      const accessToken = authService.getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
      
      const formData = new FormData();
      formData.append('profile_image', file);
      
      const response = await api.post('/account/update-profile-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Profile image upload error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const userData = getUserFromStorage();
    
    // No user data or no access token
    if (!userData?.tokens?.access) {
      return false;
    }
    
    return true;
  },

  /**
   * Get user role
   */
  getUserRole: (): string | null => {
    const userData = getUserFromStorage();
    return userData?.user?.app_level_role || userData?.role || null;
  },

  /**
   * Get access token
   */
  getAccessToken: (): string | null => {
    const userData = getUserFromStorage();
    return userData?.tokens?.access || null;
  }
};

export default authService;