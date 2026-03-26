import api from './api';

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolution?: string;
}

export interface CreateIncidentRequest {
  title: string;
  description: string;
  priority: string;
  location: string;
}

export interface UpdateIncidentRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  location?: string;
  assignedTo?: string;
  resolution?: string;
}

export const incidentService = {
  async getAllIncidents(): Promise<Incident[]> {
    try {
      const response = await api.get('/incidents');
      return response.data.data;
    } catch (error) {
      // Fallback to mock data if backend is not available
      console.warn('Using mock incident data - backend not available');
      return this.getMockIncidents();
    }
  },

  async getIncidentById(id: string): Promise<Incident> {
    try {
      const response = await api.get(`/incidents/${id}`);
      return response.data.data;
    } catch (error) {
      // Fallback to mock data
      console.warn('Using mock incident data - backend not available');
      const mockIncidents = await this.getMockIncidents();
      return mockIncidents.find(incident => incident.id === id) || mockIncidents[0];
    }
  },

  async createIncident(incident: CreateIncidentRequest): Promise<Incident> {
    const response = await api.post('/incidents', incident);
    return response.data.data;
  },

  async updateIncident(id: string, updates: UpdateIncidentRequest): Promise<Incident> {
    const response = await api.put(`/incidents/${id}`, updates);
    return response.data.data;
  },

  async deleteIncident(id: string): Promise<void> {
    await api.delete(`/incidents/${id}`);
  },

  // Mock data for development
  async getMockIncidents(): Promise<Incident[]> {
    return [
      {
        id: '1',
        title: 'Building Fire',
        description: 'Fire reported in downtown office building on the 5th floor. Multiple alarms triggered.',
        status: 'ACTIVE',
        priority: 'CRITICAL',
        createdAt: '2024-03-26T10:00:00Z',
        updatedAt: '2024-03-26T10:15:00Z',
        location: '123 Main St, Downtown, 5th Floor',
        reportedBy: 'John Doe',
        assignedTo: 'Fire Department Unit 1',
        resolution: ''
      },
      {
        id: '2',
        title: 'Medical Emergency',
        description: 'Heart attack reported at residential area',
        status: 'RESOLVED',
        priority: 'HIGH',
        createdAt: '2024-03-25T15:30:00Z',
        updatedAt: '2024-03-25T16:00:00Z',
        location: '456 Oak Ave, Residential',
        reportedBy: 'Jane Smith',
        assignedTo: 'Ambulance Service',
        resolution: 'Patient stabilized and transported to hospital'
      },
      {
        id: '3',
        title: 'Traffic Accident',
        description: 'Multi-vehicle collision on highway',
        status: 'ACTIVE',
        priority: 'HIGH',
        createdAt: '2024-03-26T08:45:00Z',
        updatedAt: '2024-03-26T09:00:00Z',
        location: 'Highway 101, Mile Marker 45',
        reportedBy: 'Highway Patrol',
        assignedTo: 'Emergency Services',
        resolution: ''
      }
    ];
  }
};
    const response = await api.put(`/incidents/${id}`, updates);
    return response.data.data;
  },

  async deleteIncident(id: string): Promise<void> {
    await api.delete(`/incidents/${id}`);
  }
};