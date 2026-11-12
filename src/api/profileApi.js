import apiClient from './client';

export const profileApi = {
  getProfile: () => apiClient.get('/profile'),
  saveProfile: (data) => apiClient.post('/profile', data),
  updateProfile: (data) => apiClient.put('/profile', data)
};
