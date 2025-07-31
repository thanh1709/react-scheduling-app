import React, { useState, useEffect, useCallback } from 'react';
import { getNotifications, createNotification, deleteNotification, markNotificationAsRead } from '../api/notificationApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      if (response.data.success) {
        setNotifications(response.data.data.items || []);
      } else {
        toast.error(response.data.message || "Failed to load notifications.");
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error(error.response?.data?.message || "Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const addDummyNotification = async () => {
    const newNotificationData = {
      message: `New notification at ${new Date().toLocaleTimeString()}`,
      // UserId: 'some-user-id' // You might want to add a real user ID here
    };
    try {
      const response = await createNotification(newNotificationData);
      if (response.data.success) {
        toast.success(response.data.message || "Dummy notification added!");
        fetchNotifications(); // Refresh the list
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
      // Backend API for clearing all notifications is not implemented.
      // For now, we'll just clear them from the UI.
      // In a real app, you'd loop through and delete each or have a bulk delete API.
      // For demonstration, we'll just set the state to empty.
      setNotifications([]);
      toast.success("All notifications cleared from UI.");
      // You would call a backend API here if available, e.g., deleteAllNotifications();
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        const response = await deleteNotification(id);
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
    try {
      const response = await markNotificationAsRead(id);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Notifications & Reminders</h1>

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
          Clear All Notifications (UI Only)
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading notifications...</p>
      ) : (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">No notifications yet.</p>
          ) : (
            notifications.map((notification) => (
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
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;