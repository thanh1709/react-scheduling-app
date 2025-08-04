import React, { useState, useEffect } from 'react';
import { getGroupMembers, kickGroupMember } from '../api/groupMembers';
import { toast } from 'react-toastify';

const GroupMembers = ({ groupId, isOwner }) => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await getGroupMembers(groupId);
                setMembers(response.data.data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load group members.');
            }
        };
        fetchMembers();
    }, [groupId]);

    const handleKickMember = async (memberId) => {
        if (window.confirm('Are you sure you want to kick this member?')) {
            try {
                await kickGroupMember(groupId, memberId);
                setMembers(members.filter(m => m.id !== memberId));
                toast.success('Member kicked successfully!');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to kick member.');
            }
        }
    };

    return (
        <div>
            <h3>Group Members</h3>
            <ul>
                {members.map(member => (
                    <li key={member.id}>
                        {member.userName}
                        {isOwner && <button onClick={() => handleKickMember(member.id)}>Kick</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupMembers;