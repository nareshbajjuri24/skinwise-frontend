import apiClient from './client';

export const catalogApi = {
  getRecipes: (params) => apiClient.get('/catalog/recipes', { params }),
  getRecipeById: (id) => apiClient.get(`/catalog/recipes/${id}`),
  getFoods: () => apiClient.get('/catalog/foods')
};
