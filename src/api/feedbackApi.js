import apiClient from './client';

export const feedbackApi = {
  submitFeedback: (data) => apiClient.post('/feedback', data),
  getFeedbackByWeek: (weekNumber) => apiClient.get(`/feedback/week/${weekNumber}`),
  getFeedbackHistory: () => apiClient.get('/feedback')
};
