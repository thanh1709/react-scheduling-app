import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GroupManagementPage from './pages/GroupManagementPage';
import NotificationsPage from './pages/NotificationsPage';
import CustomerPage from './pages/CustomerPage';
import AddCustomerToGroupPage from './pages/AddCustomerToGroupPage';
import Navbar from './components/Navbar';
import './external.css';

function App() {
  return (
    <Router>
      <div>
        <Navbar />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/group-management" element={<GroupManagementPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/add-customer-to-group" element={<AddCustomerToGroupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
