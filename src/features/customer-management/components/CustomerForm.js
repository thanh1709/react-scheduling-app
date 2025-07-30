import React, { useState, useEffect } from 'react';

const CustomerForm = ({ initialCustomer, onSave }) => {
  const [name, setName] = useState(initialCustomer ? initialCustomer.name : '');
  const [email, setEmail] = useState(initialCustomer ? initialCustomer.email : '');
  const [phone, setPhone] = useState(initialCustomer ? initialCustomer.phone : '');

  useEffect(() => {
    if (initialCustomer) {
      setName(initialCustomer.name);
      setEmail(initialCustomer.email);
      setPhone(initialCustomer.phone);
    }
  }, [initialCustomer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return; // Phone can be optional

    const customerData = {
      id: initialCustomer ? initialCustomer.id : Date.now(),
      name,
      email,
      phone,
    };
    onSave(customerData);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">{initialCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Customer Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            placeholder="customer@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone (Optional)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phone"
            type="text"
            placeholder="e.g., 123-456-7890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {initialCustomer ? 'Save Changes' : 'Add Customer'}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
