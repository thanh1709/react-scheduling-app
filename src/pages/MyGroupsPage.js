import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyGroupsPage = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [myGroups, setMyGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyGroups = async () => {
            if (!auth || !auth.token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}api/groups/my-groups`, {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                });
                setMyGroups(response.data.data.items); // Assuming paginated result
            } catch (err) {
                console.error('Failed to fetch my groups:', err);
                setError('Failed to load your groups. Please try again later.');
                toast.error('Failed to load your groups.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyGroups();
    }, [auth, navigate]);

    if (loading) {
        return <div className="text-center mt-8">Loading groups...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">My Managed Groups</h1>
            {myGroups.length === 0 ? (
                <p className="text-center text-gray-600">You are not the owner of any groups yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myGroups.map(group => (
                        <div key={group.id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
                            <p className="text-gray-600 mb-4">{group.description}</p>
                            <button
                                onClick={() => navigate(`/invite-user-to-group/${group.id}`)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                            >
                                Invite User
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyGroupsPage;
