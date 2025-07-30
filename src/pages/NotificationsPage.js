import React, { useState, useEffect } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorageHelpers';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(() => getFromLocalStorage('notifications') || []);

  useEffect(() => {
    saveToLocalStorage('notifications', notifications);
  }, [notifications]);

  const addDummyNotification = () => {
    const newNotification = {
      id: Date.now(),
      message: `New notification at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toLocaleString(),
    };
    setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg mt-8">
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
          Clear All Notifications
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500">No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="bg-gray-100 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
              <div>
                <p className="text-gray-800 font-medium">{notification.message}</p>
                <p className="text-sm text-gray-500">{notification.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
