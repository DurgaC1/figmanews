import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_VERSION, API_TIMEOUT } from '../../utils/constants';
import { ApiError, ApiResponse } from '../../types/api';
import { storageService } from '../storage/preferences';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/${API_VERSION}`,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await storageService.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message || 'An error occurred',
          code: error.code || 'UNKNOWN_ERROR',
          statusCode: error.response?.status || 500,
          details: error.response?.data,
        };

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          await storageService.clearAuthToken();
          // You can emit an event here to redirect to login
        }

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.client.get(url, { params });
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.post(url, data);
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.put(url, data);
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.patch(url, data);
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.client.delete(url);
  }
}

export const apiClient = new ApiClient();
