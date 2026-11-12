import apiClient from './client';

export const progressApi = {
  getProgressSummary: () => apiClient.get('/progress/summary')
};
