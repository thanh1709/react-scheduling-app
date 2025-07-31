import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MyCalendar from '../features/scheduling/components/Calendar';
import EventForm from '../features/scheduling/components/EventForm';
import Modal from '../features/scheduling/components/Modal';
import Drawer from '../features/scheduling/components/Drawer';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/eventApi';
import { getGroups } from '../api/groupApi';
import { getAllUsers } from '../api/userApi'; // Changed from customerApi
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month');
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);

  const [allGroups, setAllGroups] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Changed from allCustomers
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventsRes, groupsRes, usersRes] = await Promise.all([
        getEvents(),
        getGroups(),
        getAllUsers() // Changed from getCustomers()
      ]);
      setEvents(eventsRes.data.data.items.map(event => ({
        ...event,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
      })) || []);
      setAllGroups(groupsRes.data.data.items || []);
      setAllUsers(usersRes.data.data.items || []); // Corrected to access .items
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveEvent = async (eventData) => {
    try {
      if (selectedEvent) {
        // Update existing event
        const response = await updateEvent(selectedEvent.id, eventData);
        if (response.data.success) {
          setEvents(prevEvents => prevEvents.map(e =>
            e.id === selectedEvent.id ? { ...e, ...eventData, start: new Date(eventData.startDate), end: new Date(eventData.endDate) } : e
          ));
          toast.success(response.data.message || "Event updated successfully!");
        } else {
          toast.error(response.data.message || "Failed to update event.");
        }
      } else {
        // Create new event
        const response = await createEvent(eventData);
        if (response.data.success) {
          const newEvent = response.data.data; // Assuming the API returns the created event
          setEvents(prevEvents => [...prevEvents, { ...newEvent, start: new Date(newEvent.startDate), end: new Date(newEvent.endDate) }]);
          toast.success(response.data.message || "Event created successfully!");
        } else {
          toast.error(response.data.message || "Failed to create event.");
        }
      }
      setSelectedEvent(null);
      setShowModal(false);
      setShowDrawer(false);
    } catch (error) {
      console.error("Failed to save event:", error);
      toast.error(error.response?.data?.message || "Failed to save event.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await deleteEvent(eventId);
        if (response.data.success) {
          setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
          toast.success(response.data.message || "Event deleted successfully!");
          if (showModal || showDrawer) {
              setShowModal(false);
              setShowDrawer(false);
              setSelectedEvent(null);
          }
        } else {
          toast.error(response.data.message || "Failed to delete event.");
        }
      } catch (error) {
        console.error("Failed to delete event:", error);
        toast.error(error.response?.data?.message || "Failed to delete event.");
      }
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const getGroupName = useCallback((groupId) => {
    const group = allGroups.find(g => g.id === groupId);
    return group ? group.name : 'N/A';
  }, [allGroups]);

  const getUserNames = useCallback((attendeeIds) => { // Changed from getCustomerNames
    if (!attendeeIds || attendeeIds.length === 0) return 'None';
    return attendeeIds.map(id => {
      const user = allUsers.find(u => u.id === id); // Changed from allCustomers.find(c => c.id === id)
      return user ? user.userName : 'Unknown'; // Changed from customer.name
    }).join(', ');
  }, [allUsers]); // Changed from allCustomers

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    return events.filter(event => {
      const eventTitle = event.title || ''; // Ensure it's a string
      const groupName = getGroupName(event.groupId) || ''; // Ensure it's a string
      const userNames = getUserNames(event.attendees) || ''; // Ensure it's a string
      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      return (
        eventTitle.toLowerCase().includes(lowerCaseSearchTerm) ||
        groupName.toLowerCase().includes(lowerCaseSearchTerm) ||
        userNames.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
  }, [events, searchTerm, getGroupName, getUserNames]); // Changed from getCustomerNames

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg mt-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Team Scheduling Dashboard</h1>
      <div className="mb-8 text-center">
        <img src="https://via.placeholder.com/800x200/8e2de2/FFFFFF?text=Dashboard+Banner" alt="Dashboard Banner" className="mx-auto rounded-lg shadow-md" />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button onClick={() => setView('month')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${view === 'month' ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Month</button>
          <button onClick={() => setView('week')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${view === 'week' ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Week</button>
          <button onClick={() => setView('day')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${view === 'day' ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Day</button>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => { setSelectedEvent(null); setShowModal(true); }} className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
            Create Event (Modal)
          </button>
          <button onClick={() => { setSelectedEvent(null); setShowDrawer(true); }} className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
            Create Event (Drawer)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4 font-bold">Loading dashboard data...</div>
      ) : (
        <>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <MyCalendar events={events} view={view} onSelectEvent={handleSelectEvent} />
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search events by title, group, or attendees..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Event List</h2>
            {currentEvents.length === 0 ? (
              <p className="text-center text-gray-500">No events found.</p>
            ) : (
              <ul className="space-y-3">
                {currentEvents.map(event => (
                  <li key={event.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600">Group: {getGroupName(event.groupId)}</p>
                      <p className="text-sm text-gray-600">Attendees: {
                        event.attendees && event.attendees.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {event.attendees.map(attendeeId => {
                              const user = allUsers.find(u => u.id === attendeeId); // Changed from customer
                              return user ? (
                                <span key={attendeeId} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
                                  {user.userName}
                                </span>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          'None'
                        )
                      }</p>
                      <p className="text-sm text-gray-600">{new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleSelectEvent(event)}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

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
        </>
      )}

      {showModal && (
        <Modal closeModal={() => { setShowModal(false); setSelectedEvent(null); }}>
          <EventForm initialEvent={selectedEvent} onSave={handleSaveEvent} allEvents={events} allGroups={allGroups} allUsers={allUsers} />
          {selectedEvent && (
            <button
              onClick={() => { handleDeleteEvent(selectedEvent.id); setShowModal(false); setSelectedEvent(null); }}
              className="mt-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              Delete Event
            </button>
          )}
        </Modal>
      )}

      {showDrawer && (
        <Drawer closeDrawer={() => { setShowDrawer(false); setSelectedEvent(null); }}>
          <EventForm initialEvent={selectedEvent} onSave={handleSaveEvent} allEvents={events} allGroups={allGroups} allUsers={allUsers} />
          {selectedEvent && (
            <button
              onClick={() => { handleDeleteEvent(selectedEvent.id); setShowDrawer(false); setSelectedEvent(null); }}
              className="mt-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              Delete Event
            </button>
          )}
        </Drawer>
      )}
    </div>
  );
}

export default DashboardPage;
