import React, { useState, useEffect } from 'react';
import { getPendingJoinRequests, respondToJoinRequest, getAllPendingJoinRequests } from '../api/groupApi';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const GroupJoinRequestsPage = () => {
    const { groupId } = useParams();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                let response;
                if (groupId) {
                    response = await getPendingJoinRequests(groupId);
                } else {
                    response = await getAllPendingJoinRequests();
                }
                setRequests(response.data.items);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load join requests.');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [groupId]);

    const handleResponse = async (requestId, accept) => {
        try {
            await respondToJoinRequest(requestId, accept);
            setRequests(requests.filter(req => req.id !== requestId));
            toast.success(`Request ${accept ? 'accepted' : 'declined'} successfully.`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to respond to request.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Group Join Requests</h1>
            {requests.length === 0 ? (
                <p className="text-center">No pending join requests.</p>
            ) : (
                <ul>
                    {requests.map(request => (
                        <li key={request.id} className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{request.requestingUserName}</p>
                                <p className="text-gray-600">Wants to join your group: {request.groupName}</p>
                            </div>
                            <div>
                                <button onClick={() => handleResponse(request.id, true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md mr-2">Accept</button>
                                <button onClick={() => handleResponse(request.id, false)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md">Decline</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GroupJoinRequestsPage;