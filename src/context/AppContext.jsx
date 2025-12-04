import React, { createContext, useContext, useState, useMemo } from 'react';
import { initialEvents, initialPhotos, initialMessages, circles, currentUser } from '../data';
import { isSameDay } from 'date-fns';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeCircleFilter, setActiveCircleFilter] = useState('all'); // 'all' or circleId
  const [events, setEvents] = useState(initialEvents);
  const [photos, setPhotos] = useState(initialPhotos);
  const [messages, setMessages] = useState(initialMessages);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Helper to check if a user has access to a circle (implied logic: user sees circles they are in)
  // For this MVP, we assume the user is in all circles, but filtering hides content.
  // The 'activeCircleFilter' determines what is currently visible on the screen.

  const filteredEvents = useMemo(() => {
    if (activeCircleFilter === 'all') return events;
    return events.filter(e => e.circleId === activeCircleFilter);
  }, [events, activeCircleFilter]);

  const filteredPhotos = useMemo(() => {
    if (activeCircleFilter === 'all') return photos;
    return photos.filter(p => p.circleId === activeCircleFilter);
  }, [photos, activeCircleFilter]);

  const filteredMessages = useMemo(() => {
    if (activeCircleFilter === 'all') return messages; // Maybe chat shows all? Or just context?
    // Requirement: "Messages are also filtered by the selected Circle context."
    return messages.filter(m => m.circleId === activeCircleFilter);
  }, [messages, activeCircleFilter]);

  const addEvent = (newEvent) => {
    const eventWithId = { ...newEvent, id: Math.random().toString(36).substr(2, 9) };
    setEvents([...events, eventWithId]);
  };

  const addPhoto = (newPhoto) => {
     const photoWithId = { ...newPhoto, id: Math.random().toString(36).substr(2, 9) };
     setPhotos([...photos, photoWithId]);
  }

  const addMessage = (text, circleId) => {
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      text,
      timestamp: new Date(),
      circleId,
    };
    setMessages([...messages, newMessage]);
  };

  const getDayContent = (date) => {
    const daysEvents = filteredEvents.filter(e => isSameDay(e.date, date));
    const daysPhotos = filteredPhotos.filter(p => isSameDay(p.date, date));
    return { events: daysEvents, photos: daysPhotos };
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      circles,
      selectedDate,
      setSelectedDate,
      activeCircleFilter,
      setActiveCircleFilter,
      events: filteredEvents,
      photos: filteredPhotos,
      messages: filteredMessages,
      addEvent,
      addPhoto,
      addMessage,
      getDayContent,
      isSidebarOpen,
      setIsSidebarOpen,
      allEvents: events // Exposing all events might be useful for some checks, but 'events' is filtered.
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
