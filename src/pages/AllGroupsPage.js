import React, { useState, useEffect } from 'react';
import { getGroups, requestToJoinGroup } from '../api/groupApi';
import { toast } from 'react-toastify';

const AllGroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await getGroups();
                setGroups(response.data.data.items);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load groups.');
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    const handleJoinRequest = async (groupId) => {
        try {
            await requestToJoinGroup(groupId);
            toast.success('Request to join group sent successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send request.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">All Groups</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(group => (
                    <div key={group.id} className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
                        <p className="text-gray-600 mb-4">{group.description}</p>
                        <button
                            onClick={() => handleJoinRequest(group.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                        >
                            Request to Join
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllGroupsPage;
