import { apiClient } from './client';
import { User } from '../../types/user';
import { storageService } from '../storage/preferences';

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
}

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    
    await storageService.saveAuthToken(response.data.token);
    return response.data;
  },

  /**
   * Sign up new user
   */
  signup: async (data: SignupData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/signup', data);
    
    await storageService.saveAuthToken(response.data.token);
    return response.data;
  },

  /**
   * OAuth login (Google, Apple, Facebook, X)
   */
  oauthLogin: async (provider: string, token: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(`/auth/oauth/${provider}`, {
      token,
    });
    
    await storageService.saveAuthToken(response.data.token);
    return response.data;
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    await storageService.clearAuthToken();
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Refresh auth token
   */
  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await apiClient.post<{ token: string }>('/auth/refresh', {
      refreshToken,
    });
    
    await storageService.saveAuthToken(response.data.token);
    return response.data;
  },
};
