import api from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface UpdateRoleRequest {
  roleName: string;
}

export interface UpdateStatusRequest {
  status: string;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get('/users');
      return response.data.data;
    } catch (error) {
      // Fallback to mock data if backend is not available
      console.warn('Using mock user data - backend not available');
      return this.getMockUsers();
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      console.warn('Using mock user data - backend not available');
      const mockUsers = await this.getMockUsers();
      return mockUsers.find(user => user.id === id) || mockUsers[0];
    }
  },

  async updateUserRole(id: string, roleName: string): Promise<User> {
    try {
      const response = await api.patch(`/users/${id}/role`, { roleName });
      return response.data.data;
    } catch (error) {
      console.warn('Backend not available - simulating role update');
      const mockUsers = await this.getMockUsers();
      const user = mockUsers.find(u => u.id === id);
      if (user) {
        user.role = roleName;
        return user;
      }
      throw error;
    }
  },

  async updateUserStatus(id: string, status: string): Promise<User> {
    try {
      const response = await api.patch(`/users/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.warn('Backend not available - simulating status update');
      const mockUsers = await this.getMockUsers();
      const user = mockUsers.find(u => u.id === id);
      if (user) {
        user.status = status as User['status'];
        return user;
      }
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.warn('Backend not available - simulating user deletion');
      // In a real app, you'd remove from local state
    }
  },

  // Mock data for development
  async getMockUsers(): Promise<User[]> {
    return [
      {
        id: '1',
        email: 'admin@example.com',
        firstName: 'John',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        email: 'responder@example.com',
        firstName: 'Jane',
        lastName: 'Responder',
        role: 'RESPONDER',
        status: 'ACTIVE',
        createdAt: '2024-01-15T00:00:00Z'
      },
      {
        id: '3',
        email: 'viewer@example.com',
        firstName: 'Bob',
        lastName: 'Viewer',
        role: 'VIEWER',
        status: 'ACTIVE',
        createdAt: '2024-02-01T00:00:00Z'
      },
      {
        id: '4',
        email: 'inactive@example.com',
        firstName: 'Alice',
        lastName: 'Inactive',
        role: 'RESPONDER',
        status: 'INACTIVE',
        createdAt: '2024-01-20T00:00:00Z'
      }
    ];
  }
};