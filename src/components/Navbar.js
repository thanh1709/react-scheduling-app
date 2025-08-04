import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { getNotificationsCount } from '../api/notificationApi';
import { getPendingJoinRequestCount } from '../api/groupApi';
import NotificationPopup from './NotificationPopup'; // Import the new component

const Navbar = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(0);
    const [pendingJoinRequestCount, setPendingJoinRequestCount] = useState(0);
    const [showNotificationPopup, setShowNotificationPopup] = useState(false); // New state

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = auth && auth.roles && auth.roles.includes('Admin');
    const isStaff = auth && auth.roles && auth.roles.includes('Staff');

    const fetchCounts = useCallback(async () => {
        if (!auth || !auth.token) return;

        try {
            const notifResponse = await getNotificationsCount();
            if (notifResponse.data.success) {
                setNotificationCount(notifResponse.data.data);
            }

            if (isAdmin || isStaff) {
                const joinReqResponse = await getPendingJoinRequestCount();
                if (joinReqResponse.data.success) {
                    setPendingJoinRequestCount(joinReqResponse.data.data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch counts:", error);
        }
    }, [auth, isAdmin, isStaff]);

    useEffect(() => {
        fetchCounts();
        const interval = setInterval(fetchCounts, 30000); // Refetch every 30 seconds
        return () => clearInterval(interval);
    }, [auth, isAdmin, isStaff, fetchCounts]);

    const totalNotificationCount = notificationCount + pendingJoinRequestCount;

    return (
        <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold tracking-wide">
                    Scheduling App
                </Link>
                <ul className="flex space-x-6 items-center">
                    {auth && (
                        <>
                            <li>
                                <Link to="/" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/all-groups" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
                                    All Groups
                                </Link>
                            </li>
                            {(isAdmin || isStaff) && (
                                <>
                                    <li>
                                        <Link to="/group-management" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
                                            Group Management
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/my-groups" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
                                            My Groups
                                        </Link>
                                    </li>
                                </>
                            )}
                            {isAdmin && (
                                <li>
                                    <Link to="/users" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
                                        Users
                                    </Link>
                                </li>
                            )}
                            <li>
                                <button
                                    onClick={() => setShowNotificationPopup(true)} // Toggle popup visibility
                                    className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium relative bg-transparent border-none cursor-pointer"
                                >
                                    Notifications
                                    {totalNotificationCount > 0 && (
                                        <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {totalNotificationCount}
                                        </span>
                                    )}
                                </button>
                            </li>
                            <li>
                                <Link to="/profile" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
            {showNotificationPopup && <NotificationPopup onClose={() => setShowNotificationPopup(false)} />} {/* Render popup */}
        </nav>
    );
};

export default Navbar;