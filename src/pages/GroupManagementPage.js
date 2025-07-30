import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../features/scheduling/components/Modal'; // Reusing the Modal component
import GroupForm from '../features/group-management/components/GroupForm';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorageHelpers';

const GroupManagementPage = () => {
  const [groups, setGroups] = useState(() => getFromLocalStorage('groups') || []);
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage] = useState(5); // Number of groups per page

  useEffect(() => {
    saveToLocalStorage('groups', groups);
  }, [groups]);

  const handleSaveGroup = (group) => {
    if (selectedGroup) {
      setGroups(groups.map(g => (g.id === group.id ? group : g)));
    } else {
      setGroups([...groups, { ...group, id: Date.now() }]);
    }
    setSelectedGroup(null);
    setShowModal(false);
  };

  const handleDeleteGroup = (groupId) => {
    setGroups(groups.filter(group => group.id !== groupId));
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  // Filtered and paginated groups
  const filteredGroups = useMemo(() => {
    return groups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.permissions.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groups, searchTerm]);

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);

  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg mt-8">
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Group Name</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Members</th>
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
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{group.members}</td>
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
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages).keys()].map(number => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={`px-4 py-2 rounded-lg ${currentPage === number + 1 ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {number + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <Modal closeModal={() => { setShowModal(false); setSelectedGroup(null); }}>
          <GroupForm initialGroup={selectedGroup} onSave={handleSaveGroup} />
          {selectedGroup && (
            <button
              onClick={() => { handleDeleteGroup(selectedGroup.id); setShowModal(false); setSelectedGroup(null); }}
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