import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, User, Heart, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { circles, activeCircleFilter, setActiveCircleFilter } = useAppContext();
  const { t, i18n } = useTranslation();

  // Mapping circle levels to icons for visual distinction
  const getIcon = (level) => {
    switch (level) {
      case 1: return <Heart className="w-4 h-4" />;
      case 2: return <User className="w-4 h-4" />;
      case 3: return <Users className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
          K
        </div>
        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">{t('app_title')}</h1>
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
          {t('all_circles')}
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
            {/* Try to translate circle name using key pattern, fallback to name */}
             {circle.id === '1' ? t('circle_couple') :
              circle.id === '2' ? t('circle_nuclear') :
              circle.id === '3' ? t('circle_extended') : circle.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
         {/* Language Switcher */}
         <div className="relative group">
            <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 hidden group-hover:block border border-slate-100 z-50">
              <button onClick={() => changeLanguage('en')} className={`block w-full text-left rtl:text-right px-4 py-2 text-sm ${i18n.language === 'en' ? 'text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}>English</button>
              <button onClick={() => changeLanguage('he')} className={`block w-full text-left rtl:text-right px-4 py-2 text-sm ${i18n.language === 'he' ? 'text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}>עברית</button>
              <button onClick={() => changeLanguage('ru')} className={`block w-full text-left rtl:text-right px-4 py-2 text-sm ${i18n.language === 'ru' ? 'text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}>Русский</button>
            </div>
         </div>

        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold border border-indigo-200">
          D
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
