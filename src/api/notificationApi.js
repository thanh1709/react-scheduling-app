
import apiClient from './api';

export const getNotifications = (filterParams) => {
  return apiClient.get('/Notifications', { params: filterParams });
};

export const createNotification = (notificationData) => {
  return apiClient.post('/Notifications', notificationData);
};

export const updateNotification = (id, notificationData) => {
  return apiClient.put(`/Notifications/${id}`, notificationData);
};

export const deleteNotification = (id) => {
  return apiClient.delete(`/Notifications/${id}`);
};

export const markNotificationAsRead = (id) => {
  return apiClient.put(`/Notifications/mark-as-read/${id}`);
};
