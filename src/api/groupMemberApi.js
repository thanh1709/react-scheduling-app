
import apiClient from './api';

// Note: The backend seems to use UserId, not CustomerId.
// We will need to handle this mapping in the component.

export const addMemberToGroup = (groupMemberData) => {
  // groupMemberData should be an object like { GroupId: '...', UserId: '...' }
  return apiClient.post('/api/GroupMembers', groupMemberData);
};

export const getGroupMembers = (filterParams) => {
  return apiClient.get('/api/GroupMembers', { params: filterParams });
};

export const removeMemberFromGroup = (groupMemberId) => {
  return apiClient.delete(`/api/GroupMembers/${groupMemberId}`);
};
