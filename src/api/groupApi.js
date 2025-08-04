
import apiClient from './api';

export const getGroups = () => {
  return apiClient.get('/api/Groups');
};

export const createGroup = (groupData) => {
  return apiClient.post('/api/Groups', groupData);
};

export const updateGroup = (id, groupData) => {
  return apiClient.put(`/api/Groups/${id}`, groupData);
};

export const deleteGroup = (id) => {
  return apiClient.delete(`/api/Groups/${id}`);
};

export const requestToJoinGroup = (groupId) => {
  return apiClient.post(`/api/group-join-requests`, { groupId });
};

export const getPendingJoinRequests = (groupId) => {
  return apiClient.get(`/api/group-join-requests/pending/${groupId}`);
};

export const respondToJoinRequest = (requestId, accept) => {
  return apiClient.post(`/api/group-join-requests/${requestId}/respond?accept=${accept}`);
};

export const getPendingJoinRequestCount = () => {
  return apiClient.get(`/api/group-join-requests/count/pending`);
};

export const getAllPendingJoinRequests = (filterParams) => {
  return apiClient.get(`/api/group-join-requests/all/pending`, { params: filterParams });
};
