import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { initialEvents, initialPhotos, initialMessages, circles, currentUser as initialCurrentUser, users } from '../data';
import { format } from 'date-fns';

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
        messages: (parsed.messages || []).map(m => ({ ...m, timestamp: new Date(m.timestamp) }))
      };
    }
  } catch (error) {
    console.error("Failed to parse local storage data:", error);
  }

  // Fallback to initial data
  return {
    events: initialEvents,
    photos: initialPhotos,
    messages: initialMessages
  };
};

export const AppProvider = ({ children }) => {
  // Load initial data once.
  const [initialData] = useState(loadInitialState);

  const [currentUser, setCurrentUser] = useState(initialCurrentUser);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeCircleFilter, setActiveCircleFilter] = useState('all'); // 'all' or circleId

  const [events, setEvents] = useState(initialData.events);
  const [photos, setPhotos] = useState(initialData.photos);
  const [messages, setMessages] = useState(initialData.messages);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Persistence Effect: Save to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      events,
      photos,
      messages
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [events, photos, messages]);

  // Optimized Filtering using useMemo
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

  // Pre-index content by date to optimize getDayContent
  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach(e => {
      const key = format(e.date, 'yyyy-MM-dd');
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [filteredEvents]);

  const photosByDate = useMemo(() => {
    const map = {};
    filteredPhotos.forEach(p => {
      const key = format(p.date, 'yyyy-MM-dd');
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, [filteredPhotos]);

  // Optimized getDayContent - O(1) lookup
  const getDayContent = useCallback((date) => {
    const key = format(date, 'yyyy-MM-dd');
    return {
      events: eventsByDate[key] || [],
      photos: photosByDate[key] || []
    };
  }, [eventsByDate, photosByDate]);

  // Stable handlers using functional state updates where possible
  const addEvent = useCallback((newEvent) => {
    const eventWithId = { ...newEvent, id: Math.random().toString(36).substr(2, 9) };
    setEvents(prev => [...prev, eventWithId]);
  }, []);

  const addPhoto = useCallback((newPhoto) => {
     const photoWithId = { ...newPhoto, id: Math.random().toString(36).substr(2, 9) };
     setPhotos(prev => [...prev, photoWithId]);
  }, []);

  const addMessage = useCallback((text, circleId) => {
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      text,
      timestamp: new Date(),
      circleId,
    };
    setMessages(prev => [...prev, newMessage]);
  }, [currentUser.id]);

  const deleteEvent = useCallback((eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }, []);

  const deletePhoto = useCallback((photoId) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  }, []);

  const switchUser = useCallback((userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
        setCurrentUser(user);
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders in consumers
  const contextValue = useMemo(() => ({
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
  }), [
    currentUser,
    selectedDate,
    activeCircleFilter,
    filteredEvents,
    filteredPhotos,
    filteredMessages,
    addEvent,
    addPhoto,
    addMessage,
    deleteEvent,
    deletePhoto,
    switchUser,
    getDayContent,
    isSidebarOpen,
    events
  ]);

  return (
    <AppContext.Provider value={contextValue}>
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
