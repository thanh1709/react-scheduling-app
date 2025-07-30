import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../features/scheduling/components/Modal';
import CustomerForm from '../features/customer-management/components/CustomerForm';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorageHelpers';

const CustomerPage = () => {
  const [customers, setCustomers] = useState(() => getFromLocalStorage('customers') || []);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5); // Number of customers per page

  useEffect(() => {
    saveToLocalStorage('customers', customers);
  }, [customers]);

  const handleSaveCustomer = (customer) => {
    if (selectedCustomer) {
      setCustomers(customers.map(c => (c.id === customer.id ? customer : c)));
    } else {
      setCustomers([...customers, { ...customer, id: Date.now() }]);
    }
    setSelectedCustomer(null);
    setShowModal(false);
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers(customers.filter(customer => customer.id !== customerId));
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  // Filtered and paginated customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [customers, searchTerm]);

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Customer Management</h1>
      <div className="mb-8 text-center">
        <img src="https://via.placeholder.com/800x200/4a00e0/FFFFFF?text=Customer+Management" alt="Customer Management Banner" className="mx-auto rounded-lg shadow-md" />
      </div>

      <div className="mb-6">
        <button
          onClick={() => { setSelectedCustomer(null); setShowModal(true); }}
          className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Add New Customer
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentCustomers.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 px-6 text-center text-gray-500">No customers found.</td>
              </tr>
            ) : (
              currentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{customer.email}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{customer.phone}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEditCustomer(customer)} className="text-purple-600 hover:text-purple-900 mr-4">Edit</button>
                    <button onClick={() => handleDeleteCustomer(customer.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
        <Modal closeModal={() => { setShowModal(false); setSelectedCustomer(null); }}>
          <CustomerForm initialCustomer={selectedCustomer} onSave={handleSaveCustomer} />
          {selectedCustomer && (
            <button
              onClick={() => { handleDeleteCustomer(selectedCustomer.id); setShowModal(false); setSelectedCustomer(null); }}
              className="mt-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              Delete Customer
            </button>
          )}
        </Modal>
      )}
    </div>
  );
};

export default CustomerPage;