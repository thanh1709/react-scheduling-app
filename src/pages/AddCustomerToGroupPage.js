import React, { useState, useEffect, useMemo } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorageHelpers';

const AddCustomerToGroupPage = () => {
  const [customers, setCustomers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [customerGroupAssociations, setCustomerGroupAssociations] = useState(() => getFromLocalStorage('customerGroupAssociations') || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [associationsPerPage] = useState(5); // Number of associations per page

  useEffect(() => {
    setCustomers(getFromLocalStorage('customers') || []);
    setGroups(getFromLocalStorage('groups') || []);
  }, []);

  useEffect(() => {
    saveToLocalStorage('customerGroupAssociations', customerGroupAssociations);
  }, [customerGroupAssociations]);

  const handleAddAssociation = (e) => {
    e.preventDefault();
    if (selectedCustomer && selectedGroup) {
      const newAssociation = {
        customerId: parseInt(selectedCustomer),
        groupId: parseInt(selectedGroup),
        id: Date.now(),
      };
      setCustomerGroupAssociations([...customerGroupAssociations, newAssociation]);
      setSelectedCustomer('');
      setSelectedGroup('');
    }
  };

  const handleDeleteAssociation = (id) => {
    setCustomerGroupAssociations(customerGroupAssociations.filter(assoc => assoc.id !== id));
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getGroupName = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : 'Unknown Group';
  };

  // Filtered and paginated associations
  const filteredAssociations = useMemo(() => {
    return customerGroupAssociations.filter(assoc => {
      const customerName = getCustomerName(assoc.customerId).toLowerCase();
      const groupName = getGroupName(assoc.groupId).toLowerCase();
      const term = searchTerm.toLowerCase();
      return customerName.includes(term) || groupName.includes(term);
    });
  }, [customerGroupAssociations, searchTerm, customers, groups]);

  const indexOfLastAssociation = currentPage * associationsPerPage;
  const indexOfFirstAssociation = indexOfLastAssociation - associationsPerPage;
  const currentAssociations = filteredAssociations.slice(indexOfFirstAssociation, indexOfLastAssociation);

  const totalPages = Math.ceil(filteredAssociations.length / associationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add Customer to Group</h1>
      <div className="mb-8 text-center">
        <img src="https://via.placeholder.com/800x200/8e2de2/FFFFFF?text=Customer+Group+Management" alt="Customer Group Management Banner" className="mx-auto rounded-lg shadow-md" />
      </div>

      <form onSubmit={handleAddAssociation} className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
        <div className="mb-4">
          <label htmlFor="customer-select" className="block text-gray-700 text-sm font-bold mb-2">Select Customer:</label>
          <select
            id="customer-select"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">-- Select Customer --</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
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
        >
          Add Customer to Group
        </button>
      </form>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Associations</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search associations by customer or group..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Customer</th>
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
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{getCustomerName(assoc.customerId)}</td>
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
    </div>
  );
};

export default AddCustomerToGroupPage;