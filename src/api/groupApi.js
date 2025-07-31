
import apiClient from './api';

export const getGroups = () => {
  return apiClient.get('/Groups');
};

export const createGroup = (groupData) => {
  return apiClient.post('/Groups', groupData);
};

export const updateGroup = (id, groupData) => {
  return apiClient.put(`/Groups/${id}`, groupData);
};

export const deleteGroup = (id) => {
  return apiClient.delete(`/Groups/${id}`);
};
