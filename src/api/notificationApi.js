
import apiClient from './api';

export const getNotifications = (filterParams) => {
  return apiClient.get('/api/Notifications', { params: filterParams });
};

export const createNotification = (notificationData) => {
  return apiClient.post('/api/Notifications', notificationData);
};

export const updateNotification = (id, notificationData) => {
  return apiClient.put(`/api/Notifications/${id}`, notificationData);
};

export const deleteNotification = (id) => {
  return apiClient.delete(`/api/Notifications/${id}`);
};

export const markNotificationAsRead = (id) => {
  return apiClient.put(`/api/Notifications/mark-as-read/${id}`);
};

export const getNotificationsCount = () => {
  return apiClient.get(`/api/Notifications/count`);
};
