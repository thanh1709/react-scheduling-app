import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const MyCalendar = ({ events, onSelectEvent }) => {
  const eventPropGetter = (event) => {
    let classNames = [];
    const now = new Date();
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // Priority styling
    if (event.priority === 'VIP') {
      classNames.push('rbc-event-vip');
    } else {
      classNames.push('rbc-event-normal');
    }

    // Date proximity styling
    if (eventEnd < now) {
      classNames.push('rbc-event-past'); // Past event
    } else if (eventStart > now && eventStart < moment(now).add(7, 'days').toDate()) {
      classNames.push('rbc-event-near-future'); // Near future event (within 7 days)
    } else if (eventStart >= moment(now).add(7, 'days').toDate()) {
      classNames.push('rbc-event-future'); // Future event (beyond 7 days)
    }

    return {
      className: classNames.join(' '),
    };
  };

  return (
    <div className="bg-white p-4 rounded shadow" style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
};

export default MyCalendar;