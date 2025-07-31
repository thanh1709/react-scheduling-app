import apiClient from './api';

export const registerUser = (userData) => {
  return apiClient.post('/Auth/register', userData);
};

export const loginUser = (credentials) => {
  return apiClient.post('/Auth/login', credentials);
};