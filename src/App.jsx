import React from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import CalendarGrid from './components/CalendarGrid';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <AppProvider>
      <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <div className="flex-1 flex overflow-hidden relative">
          <CalendarGrid />
          <Sidebar />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
