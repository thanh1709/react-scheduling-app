import React, { useState, useEffect, useCallback } from 'react';
import { getGroupMembers } from '../../../api/groupMemberApi';

import { toast } from 'react-toastify';

const EventForm = ({ initialEvent, onSave, allEvents, allGroups, allUsers }) => { // Changed allCustomers to allUsers
  const [title, setTitle] = useState(initialEvent ? initialEvent.title : '');
  const [start, setStart] = useState(initialEvent ? new Date(initialEvent.start).toISOString().slice(0, 16) : '');
  const [end, setEnd] = useState(initialEvent ? new Date(initialEvent.end).toISOString().slice(0, 16) : '');
  const [priority, setPriority] = useState(initialEvent ? initialEvent.priority : 'Normal');
  const [selectedGroup, setSelectedGroup] = useState(initialEvent ? initialEvent.groupId : '');
  const [selectedAttendees, setSelectedAttendees] = useState(initialEvent ? initialEvent.attendees || [] : []);
  const [groupAttendees, setGroupAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || '');
      // Ensure dates are formatted correctly for datetime-local input
      setStart(initialEvent.startDate ? new Date(initialEvent.startDate).toISOString().slice(0, 16) : '');
      setEnd(initialEvent.endDate ? new Date(initialEvent.endDate).toISOString().slice(0, 16) : '');
      setPriority(initialEvent.priority || 'Normal');
      setSelectedGroup(initialEvent.groupId || '');
      setSelectedAttendees(initialEvent.attendees || []);
    }
  }, [initialEvent]);

  const fetchGroupAttendees = useCallback(async (groupId) => {
    if (!groupId) {
      setGroupAttendees([]);
      return;
    }
    setLoadingAttendees(true);
    try {
      const response = await getGroupMembers({ groupId: groupId });
      const members = response.data.data.items || [];
      // Map GroupMembers (which have UserId) to ApplicationUser objects for display
      const attendeesUsers = members.map(member => {
        const user = Array.isArray(allUsers) ? allUsers.find(u => u.id === member.userId) : undefined; // Ensure allUsers is an array
        return user ? { ...user, groupMemberId: member.id } : null;
      }).filter(Boolean);
      setGroupAttendees(attendeesUsers);
    } catch (error) {
      console.error("Failed to fetch group members:", error);
      toast.error(error.response?.data?.message || "Failed to load group members.");
    } finally {
      setLoadingAttendees(false);
    }
  }, [allUsers]); // Changed from allCustomers

  useEffect(() => {
    fetchGroupAttendees(selectedGroup);
  }, [selectedGroup, fetchGroupAttendees]);

  const handleAttendeeChange = (e) => {
    const applicationUserId = e.target.value;
    const isChecked = e.target.checked;

    setSelectedAttendees((prevAttendees) => {
      if (isChecked) {
        return [...prevAttendees, applicationUserId];
      } else {
        return prevAttendees.filter((id) => id !== applicationUserId);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !start || !end || !selectedGroup) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate < startDate) {
      toast.error('End time cannot be before start time.');
      return;
    }

    // Check for overlapping events (still client-side for now)
    const newEventStart = startDate.getTime();
    const newEventEnd = endDate.getTime();

    const isOverlapping = allEvents.some(event => {
      // If editing, skip checking against itself
      if (initialEvent && event.id === initialEvent.id) {
        return false;
      }

      const existingEventStart = new Date(event.start).getTime();
      const existingEventEnd = new Date(event.end).getTime();

      // Overlap condition: (startA < endB) && (endA > startB)
      return (newEventStart < existingEventEnd) && (newEventEnd > existingEventStart);
    });

    if (isOverlapping) {
      toast.error('This event overlaps with an existing event. Please choose a different time.');
      return;
    }

    const eventData = {
      title,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      priority,
      groupId: selectedGroup,
      attendees: selectedAttendees, // These are ApplicationUserIds
    };
    onSave(eventData);
    setTitle('');
    setStart('');
    setEnd('');
    setPriority('Normal');
    setSelectedGroup('');
    setSelectedAttendees([]);
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">{initialEvent ? 'Edit Event' : 'Add New Event'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start">
            Start Time
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="start"
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end">
            End Time
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="end"
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
            Priority
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Normal">Normal</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="group">
            Select Group
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="group"
            value={selectedGroup}
            onChange={(e) => {
              setSelectedGroup(e.target.value);
              setSelectedAttendees([]); // Clear attendees when group changes
            }}
          >
            <option value="">-- Select a Group --</option>
            {allGroups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
        {selectedGroup && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Attendees (from selected group)
            </label>
            <div className="border rounded p-2 max-h-32 overflow-y-auto">
              {loadingAttendees ? (
                <p>Loading attendees...</p>
              ) : groupAttendees.length === 0 ? (
                <p>No attendees found for this group.</p>
              ) : (
                groupAttendees.map(user => (
                  <div key={user.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`attendee-${user.id}`}
                      value={user.id} // Use user.id (ApplicationUserId)
                      checked={(selectedAttendees || []).includes(user.id)}
                      onChange={handleAttendeeChange}
                      className="mr-2"
                    />
                    <label htmlFor={`attendee-${user.id}`} className="text-gray-700">{user.userName} ({user.email})</label>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {initialEvent ? 'Save Changes' : 'Add Event'}
        </button>
      </form>
    </div>
  );
};

export default EventForm;