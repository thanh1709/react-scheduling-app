import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GroupManagementPage from './pages/GroupManagementPage';
import NotificationsPage from './pages/NotificationsPage';

import UserManagementPage from './pages/UserManagementPage';
import ProfilePage from './pages/ProfilePage';
import WeatherPage from './pages/WeatherPage';
import CreateNotificationPage from './pages/CreateNotificationPage';
import MyGroupsPage from './pages/MyGroupsPage'; // New import
import InviteUserToGroupPage from './pages/InviteUserToGroupPage'; // New import
import AllGroupsPage from './pages/AllGroupsPage';
import GroupJoinRequestsPage from './pages/GroupJoinRequestsPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import './external.css';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute allowedRoles={['Admin', 'Staff', 'User']}><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['Admin', 'Staff', 'User']}><ProfilePage /></ProtectedRoute>} />
          
          {/* Staff & Admin Routes */}
          <Route path="/group-management" element={<ProtectedRoute allowedRoles={['Admin', 'Staff']}><GroupManagementPage /></ProtectedRoute>} />
          <Route path="/my-groups" element={<ProtectedRoute allowedRoles={['Admin', 'Staff']}><MyGroupsPage /></ProtectedRoute>} /> {/* New route */}
          <Route path="/invite-user-to-group/:groupId" element={<ProtectedRoute allowedRoles={['Admin', 'Staff']}><InviteUserToGroupPage /></ProtectedRoute>} /> {/* New route */}
          <Route path="/all-groups" element={<ProtectedRoute allowedRoles={['Admin', 'Staff', 'User']}><AllGroupsPage /></ProtectedRoute>} />
          <Route path="/group-join-requests" element={<ProtectedRoute allowedRoles={['Admin', 'Staff']}><GroupJoinRequestsPage /></ProtectedRoute>} />

          {/* Admin Only Routes */}
          <Route path="/users" element={<ProtectedRoute allowedRoles={['Admin']}><UserManagementPage /></ProtectedRoute>} />

          {/* Routes for all authenticated users (can be adjusted) */}
          <Route path="/notifications" element={<ProtectedRoute allowedRoles={['Admin', 'Staff', 'User']}><NotificationsPage /></ProtectedRoute>} />
          <Route path="/create-notification" element={<ProtectedRoute allowedRoles={['Admin', 'Staff', 'User']}><CreateNotificationPage /></ProtectedRoute>} />
          <Route path="/weather" element={<ProtectedRoute allowedRoles={['Admin', 'Staff', 'User']}><WeatherPage /></ProtectedRoute>} />

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
