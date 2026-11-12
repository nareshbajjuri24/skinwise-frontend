import apiClient from './client';

export const dietPlanApi = {
  generatePlan: () => apiClient.post('/plans/generate'),
  regeneratePlan: () => apiClient.post('/plans/regenerate'),
  getCurrentPlan: () => apiClient.get('/plans/current'),
  getPlanByWeek: (weekNumber) => apiClient.get(`/plans/week/${weekNumber}`),
  getAllPlans: () => apiClient.get('/plans'),
  toggleMeal: (mealId) => apiClient.patch(`/plans/meals/${mealId}/toggle`)
};
