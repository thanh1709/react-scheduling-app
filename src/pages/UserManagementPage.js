import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllUsers, createUser, deleteUser } from '../api/userApi';
import { updateUserRoleAndInfo } from '../api/authApi';
import Modal from '../features/scheduling/components/Modal'; // Reusing existing Modal
import UserForm from '../features/user-management/components/UserForm'; // Will create this
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      if (response.data.success) {
        setUsers(response.data.data.items || []);
      } else {
        toast.error(response.data.message || "Failed to load users.");
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error(error.response?.data?.message || "Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        // For existing users, use the combined update endpoint
        const response = await updateUserRoleAndInfo(userData);
        if (response.data.success) {
          toast.success(response.data.message || "User updated successfully!");
        } else {
          toast.error(response.data.message || "Failed to update user.");
        }
      } else {
        // For new users, use the createUser endpoint
        const response = await createUser(userData);
        if (response.data.success) {
          toast.success(response.data.message || "User created successfully!");
        } else {
          toast.error(response.data.message || "Failed to create user.");
        }
      }
      fetchUsers();
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error(error.response?.data?.message || "Failed to save user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await deleteUser(userId);
        if (response.data.success) {
          toast.success(response.data.message || "User deleted successfully!");
          fetchUsers();
          if (showModal) {
              setShowModal(false);
              setSelectedUser(null);
          }
        } else {
          toast.error(response.data.message || "Failed to delete user.");
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error(error.response?.data?.message || "Failed to delete user.");
      }
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter(user =>
      (user.userName && user.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg mt-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">User Management</h1>
      <div className="mb-8 text-center">
        <img src="https://via.placeholder.com/800x200/4a00e0/FFFFFF?text=User+Management" alt="User Management Banner" className="mx-auto rounded-lg shadow-md" />
      </div>

      <div className="mb-6">
        <button
          onClick={() => { setSelectedUser(null); setShowModal(true); }}
          className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Add New User
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users by username or email..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {loading ? (
        <div className="text-center py-4 font-bold">Loading users...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Username</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Role(s)</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 px-6 text-center text-gray-500">No users found.</td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{user.userName}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{user.roles ? user.roles.join(', ') : 'N/A'}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEditUser(user)} className="text-purple-600 hover:text-purple-900 mr-4">Edit</button>
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50">Previous</button>
              {[...Array(totalPages).keys()].map(number => (
                <button key={number + 1} onClick={() => paginate(number + 1)} className={`px-4 py-2 rounded-lg ${currentPage === number + 1 ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{number + 1}</button>
              ))}
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <Modal closeModal={() => { setShowModal(false); setSelectedUser(null); }}>
          <UserForm initialUser={selectedUser} onSave={handleSaveUser} />
          {selectedUser && (
            <button
              onClick={() => handleDeleteUser(selectedUser.id)}
              className="mt-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              Delete User
            </button>
          )}
        </Modal>
      )}
    </div>
  );
};

export default UserManagementPage;
