import apiClient from './api';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}api/GroupInvitations`;

export const getPendingGroupInvitations = (pageNumber = 1, pageSize = 10) => {
    return apiClient.get(`${API_BASE_URL}/pending?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};

export const respondToGroupInvitation = (invitationId, accept) => {
    return apiClient.post(`${API_BASE_URL}/${invitationId}/respond`, { accept });
};

export const sendInvitation = (invitationData) => {
    return apiClient.post(`${API_BASE_URL}/send`, invitationData);
};
