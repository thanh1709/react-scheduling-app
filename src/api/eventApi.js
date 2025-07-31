
import apiClient from './api';

export const getEvents = (filterParams) => {
  return apiClient.get('/Events', { params: filterParams });
};

export const createEvent = (eventData) => {
  return apiClient.post('/Events', eventData);
};

export const updateEvent = (id, eventData) => {
  return apiClient.put(`/Events/${id}`, eventData);
};

export const deleteEvent = (id) => {
  return apiClient.delete(`/Events/${id}`);
};
