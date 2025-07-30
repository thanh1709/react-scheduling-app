import React from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
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
            <Link to="/login" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
              Register
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
            <Link to="/customers" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
              Customers
            </Link>
          </li>
          <li>
            <Link to="/add-customer-to-group" className="text-white hover:text-purple-200 transition duration-300 ease-in-out text-lg font-medium">
              Add Customer to Group
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
