import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  roleName: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  },

  async register(userData: RegisterRequest): Promise<UserResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post(`/auth/logout?refreshToken=${encodeURIComponent(refreshToken)}`);
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  async verifyToken(token: string): Promise<any> {
    const response = await api.post('/auth/verify', { token });
    return response.data.data;
  }
};