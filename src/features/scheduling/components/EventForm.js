import React, { useState, useEffect } from 'react';
import { getFromLocalStorage } from '../../../utils/localStorageHelpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventForm = ({ initialEvent, onSave, allEvents }) => {
  const [title, setTitle] = useState(initialEvent ? initialEvent.title : '');
  const [start, setStart] = useState(initialEvent ? new Date(initialEvent.start).toISOString().slice(0, 16) : '');
  const [end, setEnd] = useState(initialEvent ? new Date(initialEvent.end).toISOString().slice(0, 16) : '');
  const [priority, setPriority] = useState(initialEvent ? initialEvent.priority : 'Normal');
  const [selectedGroup, setSelectedGroup] = useState(initialEvent ? initialEvent.groupId : '');
  const [selectedAttendees, setSelectedAttendees] = useState(initialEvent ? initialEvent.attendees || [] : []);

  const [allGroups, setAllGroups] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [customerGroupAssociations, setCustomerGroupAssociations] = useState([]);

  useEffect(() => {
    setAllGroups(getFromLocalStorage('groups') || []);
    setAllCustomers(getFromLocalStorage('customers') || []);
    setCustomerGroupAssociations(getFromLocalStorage('customerGroupAssociations') || []);

    if (initialEvent) {
      setTitle(initialEvent.title);
      setStart(new Date(initialEvent.start).toISOString().slice(0, 16));
      setEnd(new Date(initialEvent.end).toISOString().slice(0, 16));
      setPriority(initialEvent.priority || 'Normal');
      setSelectedGroup(initialEvent.groupId || '');
      setSelectedAttendees(initialEvent.attendees || []);
    }
  }, [initialEvent]);

  const handleAttendeeChange = (e) => {
    const customerId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    setSelectedAttendees((prevAttendees) => {
      if (isChecked) {
        return [...prevAttendees, customerId];
      } else {
        return prevAttendees.filter((id) => id !== customerId);
      }
    });
  };

  const getCustomersInSelectedGroup = () => {
    if (!selectedGroup) return [];
    const groupCustomersIds = customerGroupAssociations
      .filter(assoc => assoc.groupId === parseInt(selectedGroup))
      .map(assoc => assoc.customerId);
    return allCustomers.filter(customer => groupCustomersIds.includes(customer.id));
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

    // Check for overlapping events
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
      id: initialEvent ? initialEvent.id : Date.now(),
      title,
      start: new Date(start),
      end: new Date(end),
      priority,
      groupId: parseInt(selectedGroup),
      attendees: selectedAttendees,
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
              {getCustomersInSelectedGroup().map(customer => (
                <div key={customer.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`attendee-${customer.id}`}
                    value={customer.id}
                    checked={(selectedAttendees || []).includes(customer.id)}
                    onChange={handleAttendeeChange}
                    className="mr-2"
                  />
                  <label htmlFor={`attendee-${customer.id}`} className="text-gray-700">{customer.name}</label>
                </div>
              ))}
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
      <ToastContainer />
    </div>
  );
};

export default EventForm;
