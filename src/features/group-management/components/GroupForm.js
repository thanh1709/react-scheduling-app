import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const GroupForm = ({ initialGroup, onSave }) => {
  const [name, setName] = useState(initialGroup ? initialGroup.name : '');
  const [maxMembers, setMaxMembers] = useState(initialGroup ? initialGroup.maxMembers : ''); // Changed from members to maxMembers
  const [permissions, setPermissions] = useState(initialGroup ? initialGroup.permissions : '');

  useEffect(() => {
    if (initialGroup) {
      setName(initialGroup.name);
      setMaxMembers(initialGroup.maxMembers);
      setPermissions(initialGroup.permissions);
    }
  }, [initialGroup]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !permissions) {
      toast.error('Please fill in all required fields (Group Name, Permissions).');
      return;
    }

    const groupData = {
      name,
      permissions,
      maxMembers: maxMembers ? parseInt(maxMembers, 10) : null,
      description: '' 
    };
    onSave(groupData);
    setName('');
    setMaxMembers('');
    setPermissions('');
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">{initialGroup ? 'Edit Group' : 'Add New Group'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Group Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxMembers">
            Maximum Number of Members
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="maxMembers"
            type="number"
            placeholder="e.g., 5"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="permissions">
            Permissions (comma-separated)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="permissions"
            type="text"
            placeholder="e.g., Edit, View"
            value={permissions}
            onChange={(e) => setPermissions(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {initialGroup ? 'Save Changes' : 'Add Group'}
        </button>
      </form>
    </div>
  );
};

export default GroupForm;
