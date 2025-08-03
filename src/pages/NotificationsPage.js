import React, { useState, useEffect, useCallback } from 'react';
import { getNotifications, createNotification, deleteNotification, markNotificationAsRead } from '../api/notificationApi';
import { getPendingGroupInvitations, respondToGroupInvitation } from '../api/groupInvitationApi'; // Import new API functions
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';

const NotificationsPage = () => {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]); // New state for invitations
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!auth || !auth.token) return; // Ensure user is authenticated

    try {
      setLoading(true);
      const [notifResponse, inviteResponse] = await Promise.all([
        getNotifications(auth.token), // Pass token to API call
        getPendingGroupInvitations(auth.token) // Fetch pending invitations
      ]);

      if (notifResponse.data.success) {
        setNotifications(notifResponse.data.data.items || []);
      }

      if (inviteResponse.data.success) {
        setPendingInvitations(inviteResponse.data.data.items || []);
      }

    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error(error.response?.data?.message || "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRespondToInvitation = async (invitationId, accept) => {
    if (!auth || !auth.token) {
      toast.error('You are not logged in.');
      return;
    }
    try {
      const response = await respondToGroupInvitation(auth.token, invitationId, accept);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchNotifications(); // Refresh all data
      } else {
        toast.error(response.data.message || 'Failed to respond to invitation.');
      }
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
      toast.error(error.response?.data?.message || 'Failed to respond to invitation.');
    }
  };

  const addDummyNotification = async () => {
    if (!auth || !auth.token) {
      toast.error('You are not logged in.');
      return;
    }
    const newNotificationData = {
      message: `New notification at ${new Date().toLocaleTimeString()}`,
    };
    try {
      const response = await createNotification(auth.token, newNotificationData);
      if (response.data.success) {
        toast.success(response.data.message || "Dummy notification added!");
        fetchNotifications();
      } else {
        toast.error(response.data.message || "Failed to add dummy notification.");
      }
    } catch (error) {
      console.error("Failed to add dummy notification:", error);
      toast.error(error.response?.data?.message || "Failed to add dummy notification.");
    }
  };

  const clearAllNotifications = async () => {
    if (window.confirm("Are you sure you want to clear all notifications? This action cannot be undone.")) {
      setNotifications([]);
      setPendingInvitations([]); // Clear invitations too
      toast.success("All notifications and invitations cleared from UI.");
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!auth || !auth.token) {
      toast.error('You are not logged in.');
      return;
    }
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        const response = await deleteNotification(auth.token, id);
        if (response.data.success) {
          toast.success(response.data.message || "Notification deleted!");
          fetchNotifications();
        } else {
          toast.error(response.data.message || "Failed to delete notification.");
        }
      } catch (error) {
        console.error("Failed to delete notification:", error);
        toast.error(error.response?.data?.message || "Failed to delete notification.");
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    if (!auth || !auth.token) {
      toast.error('You are not logged in.');
      return;
    }
    try {
      const response = await markNotificationAsRead(auth.token, id);
      if (response.data.success) {
        toast.success(response.data.message || "Notification marked as read!");
        fetchNotifications();
      } else {
        toast.error(response.data.message || "Failed to mark notification as read.");
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error(error.response?.data?.message || "Failed to mark notification as read.");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg mt-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Notifications & Invitations</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={addDummyNotification}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Add Dummy Notification
        </button>
        <button
          onClick={clearAllNotifications}
          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Clear All (UI Only)
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : (
        <div className="space-y-4">
          {pendingInvitations.length === 0 && notifications.length === 0 ? (
            <p className="text-center text-gray-500">No notifications or pending invitations yet.</p>
          ) : (
            <>
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="bg-yellow-100 p-4 rounded-lg border border-yellow-300 flex justify-between items-center">
                  <div>
                    <p className="text-yellow-800 font-medium">Group Invitation: You've been invited to join <span className="font-bold">{invitation.groupName}</span> by <span className="font-bold">{invitation.inviterUsername}</span>.</p>
                    <p className="text-sm text-yellow-700">Sent on: {new Date(invitation.dateSent).toLocaleString()}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleRespondToInvitation(invitation.id, true)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespondToInvitation(invitation.id, false)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}

              {notifications.map((notification) => (
                <div key={notification.id} className={`bg-gray-100 p-4 rounded-lg border border-gray-200 flex justify-between items-center ${notification.isRead ? 'opacity-60' : ''}`}>
                  <div>
                    <p className="text-gray-800 font-medium">{notification.message}</p>
                    <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
              }
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;