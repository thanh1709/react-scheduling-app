import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sendInvitation } from '../api/groupInvitationApi';
import apiClient from '../api/api';
import { toast } from 'react-toastify';

const InviteUserToGroupPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [groupName, setGroupName] = useState('');

    const [loading, setLoading] = useState(true);
    const [groupLoading, setGroupLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            if (!auth || !auth.token) {
                navigate('/login');
                return;
            }
            try {
                const response = await apiClient.get(`/groups/${groupId}`);
                if (response.data.success) {
                    setGroupName(response.data.data.name);
                } else {
                    setError(response.data.message || 'Failed to load group details.');
                    toast.error(response.data.message || 'Failed to load group details.');
                }
            } catch (err) {
                console.error('Failed to fetch group details:', err.response || err);
                setError('Failed to load group details. Please try again.');
                toast.error('Failed to load group details.');
            } finally {
                setGroupLoading(false);
            }
        };

        const fetchUsersForLookup = async () => {
            if (!auth || !auth.token) {
                navigate('/login');
                return;
            }
            try {
                const response = await apiClient.get(`/applicationusers/lookup`);
                if (response.data.success) {
                    setUsers(response.data.data);
                } else {
                    setError(response.data.message || 'Failed to load users.');
                    toast.error(response.data.message || 'Failed to load users.');
                }
            } catch (err) {
                console.error('Failed to fetch users:', err.response || err);
                setError('Failed to load users. Please try again.');
                toast.error('Failed to load users.');
            } finally {
                setUsersLoading(false);
            }
        };

        fetchGroupDetails();
        fetchUsersForLookup();
    }, [groupId, auth, navigate]);

    useEffect(() => {
        setLoading(groupLoading || usersLoading);
    }, [groupLoading, usersLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!auth || !auth.token) {
            toast.error('You are not logged in.');
            navigate('/login');
            return;
        }

        if (!selectedUserId) {
            setError('Please select a user to invite.');
            setLoading(false);
            return;
        }

        const invitedUser = users.find(u => u.id === selectedUserId);
        if (!invitedUser || !invitedUser.email) {
            setError('Selected user\'s email not found. Please select a valid user.');
            setLoading(false);
            return;
        }

        try {
            const invitationData = {
                groupId: groupId, // groupId is already a string from useParams()
                invitedUserEmail: invitedUser.email
            };

            console.log('Sending invitation data:', invitationData); // For debugging

            const response = await sendInvitation(invitationData);
            if (response.data.success) {
                toast.success('Invitation sent successfully!');
                navigate(`/my-groups`); // Redirect back to my groups page
            } else {
                const errorMessage = response.data.message || 'Failed to send invitation. Unknown error.';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (err) {
            console.error('Failed to send invitation:', err.response || err);
            const errorMessage = err.response?.data?.message || 'Failed to send invitation. Please check the user and try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Invite User to Group</h1>
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                <p className="text-lg mb-4">Inviting user to Group: <span className="font-semibold">{groupName || groupId}</span></p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="userSelect" className="block text-gray-700 text-sm font-bold mb-2">
                            Select User:
                        </label>
                        <select
                            id="userSelect"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            required
                        >
                            <option value="">-- Select a user --</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.userName} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Invitation'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InviteUserToGroupPage;