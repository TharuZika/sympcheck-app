import { getApiUrl } from '../config/api';
import authService from './authService';

export interface SymptomHistoryItem {
  id: number;
  userId: number;
  originalInput: string;
  processedSymptoms: string[];
  predictions: any[];
  age?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryResponse {
  status: string;
  data: {
    history: SymptomHistoryItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface AnalyticsData {
  totalChecks: number;
  topSymptoms: { symptom: string; count: number }[];
  topDiseases: { disease: string; count: number }[];
  monthlyData: { [key: string]: number };
  period: {
    from: string;
    to: string;
    months: number;
  };
}

class HistoryService {
  private getAuthHeaders() {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getHistory(page: number = 1, limit: number = 10, startDate?: string, endDate?: string): Promise<HistoryResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(getApiUrl(`/api/v1/history?${params.toString()}`), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get history');
    }

    return response.json();
  }

  async getHistoryById(id: number): Promise<SymptomHistoryItem> {
    const response = await fetch(getApiUrl(`/api/v1/history/${id}`), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get history item');
    }

    const data = await response.json();
    return data.data;
  }

  async deleteHistory(id: number): Promise<void> {
    const response = await fetch(getApiUrl(`/api/v1/history/${id}`), {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete history item');
    }
  }

  async getAnalytics(months: number = 6): Promise<AnalyticsData> {
    const response = await fetch(getApiUrl(`/api/v1/history/analytics?months=${months}`), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get analytics');
    }

    const data = await response.json();
    return data.data;
  }
}

export default new HistoryService();
