import api from './api';

export const getGroupMembers = async (groupId) => {
    return await api.get(`/api/groupmembers/ByGroup/${groupId}`);
};

export const kickGroupMember = async (groupId, memberId) => {
    return await api.delete(`/api/groupmembers/kick/${groupId}/${memberId}`);
};