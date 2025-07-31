import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllUsers } from '../api/userApi'; // Changed from customerApi
import { getGroups } from '../api/groupApi';
import { getGroupMembers, addMemberToGroup, removeMemberFromGroup } from '../api/groupMemberApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUserToGroupPage = () => {
  const [users, setUsers] = useState([]); // Changed from customers
  const [groups, setGroups] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(''); // Changed from selectedCustomer
  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [associationsPerPage] = useState(5);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, groupsRes, associationsRes] = await Promise.all([
        getAllUsers(), // Changed from getCustomers()
        getGroups(),
        getGroupMembers()
      ]);
      setUsers(usersRes.data.data.items || []); // Assuming getAllUsers returns a paginated result
      setGroups(groupsRes.data.data.items || []);
      setAssociations(associationsRes.data.data.items || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load page data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddAssociation = async (e) => {
    e.preventDefault();
    if (selectedUser && selectedGroup) {
      const associationData = {
        GroupId: selectedGroup,
        UserId: selectedUser, // Using selectedUser (which is ApplicationUserId)
      };

      try {
        const response = await addMemberToGroup(associationData);
        if (response.data.success) {
          toast.success("User added to group successfully!");
          fetchData(); // Refresh all data
          setSelectedUser('');
          setSelectedGroup('');
        } else {
          toast.error(response.data.message || "Failed to add user to group.");
        }
      } catch (error) {
        console.error("Failed to add association:", error);
        toast.error(error.response?.data?.message || "Failed to add user to group.");
      }
    }
  };

  const handleDeleteAssociation = async (associationId) => {
    if (window.confirm("Are you sure you want to remove this member from the group?")) {
        try {
            const response = await removeMemberFromGroup(associationId);
            if (response.data.success) {
              toast.success("Member removed successfully!");
              fetchData(); // Refresh data
            } else {
              toast.error(response.data.message || "Failed to remove member.");
            }
        } catch (error) {
            console.error("Failed to delete association:", error);
            toast.error(error.response?.data?.message || "Failed to remove member.");
        }
    }
  };

  const getUserName = useCallback((userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.userName : 'Unknown User';
  }, [users]);

  const getGroupName = useCallback((groupId) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : 'Unknown Group';
  }, [groups]);

  const filteredAssociations = useMemo(() => {
    if (!Array.isArray(associations)) return [];
    return associations.filter(assoc => {
      // Ensure assoc, assoc.userId, and assoc.groupId are not null/undefined
      if (!assoc || (assoc.userId === undefined || assoc.userId === null) || (assoc.groupId === undefined || assoc.groupId === null)) {
        return false; // Skip malformed associations
      }

      const userName = (getUserName(assoc.userId) || '').toLowerCase();
      const groupName = (getGroupName(assoc.groupId) || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      return userName.includes(term) || groupName.includes(term);
    });
  }, [associations, searchTerm, getUserName, getGroupName]);

  const indexOfLastAssociation = currentPage * associationsPerPage;
  const indexOfFirstAssociation = indexOfLastAssociation - associationsPerPage;
  const currentAssociations = filteredAssociations.slice(indexOfFirstAssociation, indexOfLastAssociation);
  const totalPages = Math.ceil(filteredAssociations.length / associationsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg mt-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add User to Group</h1>
      <div className="mb-8 text-center">
        <img src="https://via.placeholder.com/800x200/8e2de2/FFFFFF?text=User+Group+Management" alt="User Group Management Banner" className="mx-auto rounded-lg shadow-md" />
      </div>

      <form onSubmit={handleAddAssociation} className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
        <div className="mb-4">
          <label htmlFor="user-select" className="block text-gray-700 text-sm font-bold mb-2">Select User:</label>
          <select
            id="user-select"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Select User --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.userName} ({user.email})</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="group-select" className="block text-gray-700 text-sm font-bold mb-2">Select Group:</label>
          <select
            id="group-select"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Select Group --</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
          disabled={loading || !selectedUser || !selectedGroup}
        >
          Add User to Group
        </button>
      </form>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Associations</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search associations by user or group..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>
      {loading ? (
        <div className="text-center py-4 font-bold">Loading associations...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">User</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Group</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentAssociations.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-4 px-6 text-center text-gray-500">No associations yet.</td>
                  </tr>
                ) : (
                  currentAssociations.map(assoc => (
                    <tr key={assoc.id}>
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{getUserName(assoc.userId)}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{getGroupName(assoc.groupId)}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleDeleteAssociation(assoc.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
    </div>
  );
};

export default AddUserToGroupPage;