
import apiClient from './api';

// Note: The backend seems to use UserId, not CustomerId.
// We will need to handle this mapping in the component.

export const addMemberToGroup = (groupMemberData) => {
  // groupMemberData should be an object like { GroupId: '...', UserId: '...' }
  return apiClient.post('/GroupMembers', groupMemberData);
};

export const getGroupMembers = (filterParams) => {
  return apiClient.get('/GroupMembers', { params: filterParams });
};

export const removeMemberFromGroup = (groupMemberId) => {
  return apiClient.delete(`/GroupMembers/${groupMemberId}`);
};
