import React, { useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../api/notificationApi';
import { getPendingJoinRequestCount } from '../api/groupApi';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const NotificationPopup = ({ onClose }) => {
    const { auth } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [pendingJoinRequestCount, setPendingJoinRequestCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotificationsAndCounts = useCallback(async () => {
        if (!auth || !auth.token) return;

        try {
            const notifResponse = await getNotifications();
            if (notifResponse.data.success) {
                setNotifications(notifResponse.data.data.items || []);
            }

            if (auth.roles.includes('Admin') || auth.roles.includes('Staff')) {
                const countResponse = await getPendingJoinRequestCount();
                if (countResponse.data.success) {
                    setPendingJoinRequestCount(countResponse.data.data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch notifications or counts:", error);
            toast.error(error.response?.data?.message || "Failed to load notifications.");
        } finally {
            setLoading(false);
        }
    }, [auth]);

    useEffect(() => {
        fetchNotificationsAndCounts();
    }, [auth, fetchNotificationsAndCounts]);

    const handleMarkAsRead = async (id) => {
        try {
            const response = await markNotificationAsRead(id);
            if (response.data.success) {
                toast.success(response.data.message || "Notification marked as read!");
                fetchNotificationsAndCounts();
            } else {
                toast.error(response.data.message || "Failed to mark notification as read.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to mark notification as read.");
        }
    };

    const handleDeleteNotification = async (id) => {
        if (window.confirm("Are you sure you want to delete this notification?")) {
            try {
                const response = await deleteNotification(id);
                if (response.data.success) {
                    toast.success(response.data.message || "Notification deleted!");
                    fetchNotificationsAndCounts();
                } else {
                    toast.error(response.data.message || "Failed to delete notification.");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete notification.");
            }
        }
    };

    const isGroupOwner = auth.roles.includes('Admin') || auth.roles.includes('Staff');

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}> {/* Prevent click from closing popup */}
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Your Notifications</h3>
                    <div className="mt-2 px-7 py-3">
                        {loading ? (
                            <p>Loading notifications...</p>
                        ) : (
                            <div className="space-y-2">
                                {isGroupOwner && pendingJoinRequestCount > 0 && (
                                    <div className="bg-blue-100 p-3 rounded-lg border border-blue-300 flex justify-between items-center">
                                        <div>
                                            <p className="text-blue-800 text-sm font-medium">{pendingJoinRequestCount} pending join request(s).</p>
                                        </div>
                                        <div>
                                            <Link to="/group-join-requests" onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs">View</Link>
                                        </div>
                                    </div>
                                )}
                                {notifications.length === 0 && pendingJoinRequestCount === 0 ? (
                                    <p className="text-gray-500 text-sm">No new notifications.</p>
                                ) : (
                                    notifications.map(notification => (
                                        <div key={notification.id} className={`p-3 rounded-md flex justify-between items-center text-left ${notification.isRead ? 'bg-gray-100 text-gray-500' : 'bg-purple-50 text-gray-800'}`}>
                                            <div>
                                                <p className="font-medium text-sm">{notification.message}</p>
                                                <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                                            </div>
                                            <div className="flex space-x-1">
                                                {!notification.isRead && (
                                                    <button onClick={() => handleMarkAsRead(notification.id)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md text-xs">Read</button>
                                                )}
                                                <button onClick={() => handleDeleteNotification(notification.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs">Delete</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            id="ok-btn"
                            className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;