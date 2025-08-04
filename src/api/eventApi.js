
import apiClient from './api';

export const getEvents = (filterParams) => {
  return apiClient.get('/api/Events', { params: filterParams });
};

export const createEvent = (eventData) => {
  return apiClient.post('/api/Events', eventData);
};

export const updateEvent = (id, eventData) => {
  return apiClient.put(`/api/Events/${id}`, eventData);
};

export const deleteEvent = (id) => {
  return apiClient.delete(`/api/Events/${id}`);
};
