
import React, { useState, useEffect } from 'react';

const UserForm = ({ initialUser, onSave }) => {
  const [userName, setUserName] = useState(initialUser ? initialUser.userName : '');
  const [email, setEmail] = useState(initialUser ? initialUser.email : '');
  const [password, setPassword] = useState(''); // Only for new user or changing password

  useEffect(() => {
    if (initialUser) {
      setUserName(initialUser.userName);
      setEmail(initialUser.email);
      setPassword(''); // Clear password field on edit
    } else {
      setUserName('');
      setEmail('');
      setPassword('');
    }
  }, [initialUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName || !email || (!initialUser && !password)) {
      // Password is required for new users
      alert('Please fill in all required fields.');
      return;
    }

    const userData = {
      id: initialUser ? initialUser.id : null, // ID is null for new users, backend will generate
      userName,
      email,
    };

    if (password) {
      userData.newPassword = password; // Use newPassword for update, password for create
    }

    onSave(userData);
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">{initialUser ? 'Edit User' : 'Add New User'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="userName"
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            {initialUser ? 'New Password (optional)' : 'Password'}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder={initialUser ? 'Leave blank to keep current' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {initialUser ? 'Save Changes' : 'Add User'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
