import apiClient from './api';

export const getAllUsers = (filterParams) => {
  return apiClient.get('/ApplicationUsers', { params: filterParams });
};

export const getUserById = (userId) => {
  return apiClient.get(`/ApplicationUsers/${userId}`);
};

export const createUser = (userData) => {
  // Password is now set on the backend, so we don't send it from here
  const { newPassword, ...dataWithoutPassword } = userData;
  return apiClient.post('/ApplicationUsers', dataWithoutPassword);
};

export const deleteUser = (userId) => {
  return apiClient.delete(`/ApplicationUsers/${userId}`);
};