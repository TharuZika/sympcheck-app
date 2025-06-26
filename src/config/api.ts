export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.2:5000',
  ENDPOINTS: {
    SYMPTOM_ANALYSIS: '/api/v1/symptoms/analyze',
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 