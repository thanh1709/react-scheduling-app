import apiClient from './api';

export const registerUser = (userData) => {
  return apiClient.post('/api/Auth/register', userData);
};

export const loginUser = (credentials) => {
  return apiClient.post('/api/Auth/login', credentials);
};

export const updateUserRoleAndInfo = (userData) => {
  return apiClient.put('/api/Auth/update-user-role', userData);
};