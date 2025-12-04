import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, User, Heart } from 'lucide-react';

const Navbar = () => {
  const { circles, activeCircleFilter, setActiveCircleFilter } = useAppContext();

  // Mapping circle levels to icons for visual distinction
  const getIcon = (level) => {
    switch (level) {
      case 1: return <Heart className="w-4 h-4" />;
      case 2: return <User className="w-4 h-4" />;
      case 3: return <Users className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
          K
        </div>
        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">KinCal</h1>
      </div>

      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg overflow-x-auto">
        <button
          onClick={() => setActiveCircleFilter('all')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeCircleFilter === 'all'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          All Circles
        </button>
        {circles.map((circle) => (
          <button
            key={circle.id}
            onClick={() => setActiveCircleFilter(circle.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeCircleFilter === circle.id
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {getIcon(circle.level)}
            {circle.name}
          </button>
        ))}
      </div>

      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold border border-indigo-200">
        D
      </div>
    </nav>
  );
};

export default Navbar;
