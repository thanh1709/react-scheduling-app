import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Modal from '../features/scheduling/components/Modal';
import GroupForm from '../features/group-management/components/GroupForm';
import { getGroups, createGroup, updateGroup, deleteGroup } from '../api/groupApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GroupManagementPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage] = useState(5);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getGroups();
      // The actual data is in response.data.data.items based on the backend structure
      setGroups(response.data.data.items || []);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toast.error(error.response?.data?.message || "Failed to load groups. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleSaveGroup = async (group) => {
    try {
      if (selectedGroup) {
        // The form data is in 'group', the id is in 'selectedGroup.id'
        const response = await updateGroup(selectedGroup.id, group);
        if (response.data.success) {
          toast.success(response.data.message || "Group updated successfully!");
        } else {
          toast.error(response.data.message || "Failed to update group.");
        }
      } else {
        const response = await createGroup(group);
        if (response.data.success) {
          toast.success(response.data.message || "Group created successfully!");
        } else {
          toast.error(response.data.message || "Failed to create group.");
        }
      }
      fetchGroups(); // Refresh the list from the server
      setShowModal(false);
      setSelectedGroup(null);
    } catch (error) {
      console.error("Failed to save group:", error);
      toast.error(error.response?.data?.message || "Failed to save group.");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    // Adding a confirmation dialog before deleting
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        const response = await deleteGroup(groupId);
        if (response.data.success) {
          toast.success(response.data.message || "Group deleted successfully!");
          fetchGroups(); // Refresh the list
          // If the modal for this group was open, close it
          if (showModal && selectedGroup && selectedGroup.id === groupId) {
              setShowModal(false);
              setSelectedGroup(null);
          }
        } else {
          toast.error(response.data.message || "Failed to delete group.");
        }
      } catch (error) {
        console.error("Failed to delete group:", error);
        toast.error(error.response?.data?.message || "Failed to delete group.");
      }
    }
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  const filteredGroups = useMemo(() => {
    if (!Array.isArray(groups)) return [];
    return groups.filter(group =>
      (group.name && group.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (group.permissions && group.permissions.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [groups, searchTerm]);

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg mt-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Group Management & Permissions</h1>
        <div className="mb-8 text-center">
            <img src="https://via.placeholder.com/800x200/4a00e0/FFFFFF?text=Group+Management" alt="Group Management Banner" className="mx-auto rounded-lg shadow-md" />
        </div>

        <div className="mb-6">
            <button
                onClick={() => { setSelectedGroup(null); setShowModal(true); }}
                className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
                Add New Group
            </button>
        </div>

        <div className="mb-4">
            <input
                type="text"
                placeholder="Search groups by name or permissions..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
        </div>

        {loading ? (
            <div className="text-center py-4 font-bold">Loading groups...</div>
        ) : (
            <>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Group Name</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Max Members</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Permissions</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentGroups.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-4 px-6 text-center text-gray-500">No groups found.</td>
                                </tr>
                            ) : (
                                currentGroups.map((group) => (
                                    <tr key={group.id}>
                                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{group.maxMembers}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{group.permissions}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleEditGroup(group)} className="text-purple-600 hover:text-purple-900 mr-4">Edit</button>
                                            <button onClick={() => handleDeleteGroup(group.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
            <Modal closeModal={() => { setShowModal(false); setSelectedGroup(null); }}>
                <GroupForm initialGroup={selectedGroup} onSave={handleSaveGroup} />
                {selectedGroup && (
                    <button
                        onClick={() => handleDeleteGroup(selectedGroup.id)}
                        className="mt-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                    >
                        Delete Group
                    </button>
                )}
            </Modal>
        )}
    </div>
  );
};

export default GroupManagementPage;
