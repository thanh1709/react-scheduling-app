import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = auth && auth.roles && auth.roles.includes('Admin');
    const isStaff = auth && auth.roles && auth.roles.includes('Staff');

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
        </nav>
    );
};

export default Navbar;
