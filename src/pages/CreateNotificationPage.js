import React, { useState } from 'react';
import apiClient from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateNotificationPage = () => {
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(''); // Optional: if notification is for a specific user
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    setError('');

    try {
      const notificationData = {
        message,
        userId: userId || null, // Send null if userId is empty
      };
      const response = await apiClient.post('/Notifications', notificationData);
      if (response.data.success) { // Check for success property
        toast.success(response.data.message || 'Notification created successfully!');
        setMessage('');
        setUserId('');
      } else {
        toast.error(response.data.message || 'Failed to create notification.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create notification.');
      console.error('Error creating notification:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create New Notification
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {responseMessage && <p className="text-green-500 text-center">{responseMessage}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="message" className="sr-only">Notification Message</label>
              <textarea
                id="message"
                name="message"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Notification Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
              ></textarea>
            </div>
            <div>
              <label htmlFor="userId" className="sr-only">User ID (Optional)</label>
              <input
                id="userId"
                name="userId"
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="User ID (Optional)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNotificationPage;
