import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold tracking-wide">
          Scheduling App
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/group-management" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
              Group Management
            </Link>
          </li>
          <li>
            <Link to="/notifications" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
              Notifications
            </Link>
          </li>
          <li>
            <Link to="/create-notification" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
              Create Notification
            </Link>
          </li>
          <li>
            <Link to="/users" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
              Users
            </Link>
          </li>
          <li>
            <Link to="/add-user-to-group" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
              Add User to Group
            </Link>
          </li>
          <li>
            <Link to="/profile" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
              Profile
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
