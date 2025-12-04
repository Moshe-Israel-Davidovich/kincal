import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { initialEvents, initialPhotos, initialMessages, circles, users, currentUser as defaultUser } from '../data';
import { isSameDay } from 'date-fns';

const AppContext = createContext();

const STORAGE_KEY = 'kincal_data';

// Helper to load initial state from local storage or fallback to data.js
const loadInitialState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Revive Date objects from ISO strings
      return {
        events: (parsed.events || []).map(e => ({ ...e, date: new Date(e.date) })),
        photos: (parsed.photos || []).map(p => ({ ...p, date: new Date(p.date) })),
        messages: (parsed.messages || []).map(m => ({ ...m, timestamp: new Date(m.timestamp) })),
        currentUser: parsed.currentUser || defaultUser
      };
    }
  } catch (error) {
    console.error("Failed to parse local storage data:", error);
  }

  // Fallback to initial data
  return {
    events: initialEvents,
    photos: initialPhotos,
    messages: initialMessages,
    currentUser: defaultUser
  };
};

export const AppProvider = ({ children }) => {
  // Load initial data once.
  const [initialData] = useState(loadInitialState);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeCircleFilter, setActiveCircleFilter] = useState('all'); // 'all' or circleId

  const [events, setEvents] = useState(initialData.events);
  const [photos, setPhotos] = useState(initialData.photos);
  const [messages, setMessages] = useState(initialData.messages);
  const [currentUser, setCurrentUser] = useState(initialData.currentUser);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Persistence Effect: Save to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      events,
      photos,
      messages,
      currentUser
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [events, photos, messages, currentUser]);

  const filteredEvents = useMemo(() => {
    if (activeCircleFilter === 'all') return events;
    return events.filter(e => e.circleId === activeCircleFilter);
  }, [events, activeCircleFilter]);

  const filteredPhotos = useMemo(() => {
    if (activeCircleFilter === 'all') return photos;
    return photos.filter(p => p.circleId === activeCircleFilter);
  }, [photos, activeCircleFilter]);

  const filteredMessages = useMemo(() => {
    if (activeCircleFilter === 'all') return messages;
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

  const deleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const deletePhoto = (photoId) => {
    setPhotos(photos.filter(p => p.id !== photoId));
  };

  const switchUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
        setCurrentUser(user);
    }
  };

  const getDayContent = (date) => {
    const daysEvents = filteredEvents.filter(e => isSameDay(e.date, date));
    const daysPhotos = filteredPhotos.filter(p => isSameDay(p.date, date));
    return { events: daysEvents, photos: daysPhotos };
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
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
      deleteEvent,
      deletePhoto,
      switchUser,
      getDayContent,
      isSidebarOpen,
      setIsSidebarOpen,
      allEvents: events
    }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
