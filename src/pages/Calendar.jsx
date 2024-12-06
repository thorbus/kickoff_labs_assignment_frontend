import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventCreationModal from "../components/EventCreationModal";
import EventDetailsModal from "../components/EventDetailsModal";
import axios from "axios";
import Loader from "../components/Loader";
import "../styles/calendar.css";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [isEventCreationModalOpen, setIsEventCreationModalOpen] =
    useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const headers = {
    Authorization: `Token ${sessionStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const endpoints = [
          "calendar/event/running_events",
          "calendar/event/upcoming_events",
          "calendar/event/completed_events",
        ];

        const eventPromises = endpoints.map((endpoint) =>
          axios.get(`${baseUrl}/${endpoint}`, { headers })
        );

        const allEventResults = await Promise.all(eventPromises);

        const formattedEvents = allEventResults
          .flatMap((response) => response.data)
          .map((event) => ({
            id: event.id,
            title: event.title,
            start: event.start_time,
            end: event.end_time,
            description: event.description,
            allDay: false,
          }));

        setEvents(formattedEvents);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setIsEventDetailsModalOpen(true);
  };

  const handleAddEventButtonClick = () => {
    setSelectedDateInfo(null);
    setIsEventCreationModalOpen(true);
  };

  const handleEventUpdate = (updatedEvent) => {
    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id
        ? {
            id: updatedEvent.id,
            title: updatedEvent.title,
            start: updatedEvent.start_time,
            end: updatedEvent.end_time,
            description: updatedEvent.description,
            allDay: false,
          }
        : event
    );
    setEvents(updatedEvents);
  };


  if (error) return <div>Error loading events: {error.message}</div>;

  return (
    <div className="calendar-container">
      {isLoading ? (
        <Loader />
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "title",
            center: "dayGridMonth,timeGridWeek,timeGridDay",
            right: "prev,next today addEventButton",
          }}
          customButtons={{
            addEventButton: {
              text: "Add Event",
              click: handleAddEventButtonClick,
            },
          }}
          aspectRatio={1}
          height="auto"
          events={events}
          editable={false}
          dayMaxEvents={true}
          displayEventTime={false}
          displayEventEnd={true}
          eventDisplay="block"
          eventOverlap={true}
          eventLongPressDelay={0}
          eventClick={handleEventClick}
          allDaySlot={true}
          eventColor="#3788d8"
          eventBorderColor="#3788d8"
          eventTextColor="white"
        />
      )}

      {/* Event Creation Modal */}
      <EventCreationModal
        isOpen={isEventCreationModalOpen}
        onClose={() => {
          setIsEventCreationModalOpen(false);
          if (selectedDateInfo) {
            selectedDateInfo.view.calendar.unselect();
          }
        }}
        selectedDateInfo={selectedDateInfo}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isEventDetailsModalOpen}
        event={selectedEvent}
        onClose={() => setIsEventDetailsModalOpen(false)}
        onEventUpdate={handleEventUpdate}
      />
    </div>
  );
};

export default Calendar;
