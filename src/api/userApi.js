import apiClient from './api';

export const getAllUsers = (filterParams) => {
  return apiClient.get('/ApplicationUsers', { params: filterParams });
};

export const getUserById = (userId) => {
  return apiClient.get(`/ApplicationUsers/${userId}`);
};

export const createUser = (userData) => {
  return apiClient.post('/ApplicationUsers', userData);
};

export const updateUser = (userId, userData) => {
  return apiClient.put(`/ApplicationUsers/${userId}`, userData);
};

export const deleteUser = (userId) => {
  return apiClient.delete(`/ApplicationUsers/${userId}`);
};