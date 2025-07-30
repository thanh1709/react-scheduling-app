import React, { useState, useEffect } from 'react';

const GroupForm = ({ initialGroup, onSave }) => {
  const [name, setName] = useState(initialGroup ? initialGroup.name : '');
  const [members, setMembers] = useState(initialGroup ? initialGroup.members : '');
  const [permissions, setPermissions] = useState(initialGroup ? initialGroup.permissions : '');

  useEffect(() => {
    if (initialGroup) {
      setName(initialGroup.name);
      setMembers(initialGroup.members);
      setPermissions(initialGroup.permissions);
    }
  }, [initialGroup]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !members || !permissions) return;

    const groupData = {
      id: initialGroup ? initialGroup.id : Date.now(),
      name,
      members: parseInt(members),
      permissions,
    };
    onSave(groupData);
    setName('');
    setMembers('');
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="members">
            Number of Members
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="members"
            type="number"
            placeholder="e.g., 5"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
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
