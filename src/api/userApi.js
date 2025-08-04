import apiClient from './api';

export const getAllUsers = (filterParams) => {
  return apiClient.get('/api/ApplicationUsers', { params: filterParams });
};

export const getUserById = (userId) => {
  return apiClient.get(`/api/ApplicationUsers/${userId}`);
};

export const createUser = (userData) => {
  // Password is now set on the backend, so we don't send it from here
  const { newPassword, ...dataWithoutPassword } = userData;
  return apiClient.post('/api/ApplicationUsers', dataWithoutPassword);
};

export const deleteUser = (userId) => {
  return apiClient.delete(`/api/ApplicationUsers/${userId}`);
};