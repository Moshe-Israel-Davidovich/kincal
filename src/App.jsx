import React from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import CalendarGrid from './components/CalendarGrid';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <AppProvider>
      <div className="h-screen flex flex-col bg-stone-50 text-slate-900 font-sans">
        <Navbar />
        <div className="flex-1 flex overflow-hidden relative p-4 lg:p-6 gap-4 lg:gap-6 max-w-7xl mx-auto w-full">
          <CalendarGrid />
          <Sidebar />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
