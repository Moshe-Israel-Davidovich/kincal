import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, User, Heart, Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { circles, activeCircleFilter, setActiveCircleFilter, currentUser, users, switchUser } = useAppContext();
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
    <nav className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-stone-900 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
          K
        </div>
        <h1 className="text-xl font-bold text-stone-800 hidden sm:block tracking-tight">{t('app_title')}</h1>
      </div>

      <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl overflow-x-auto border border-stone-200/50">
        <button
          onClick={() => setActiveCircleFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeCircleFilter === 'all'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-stone-500 hover:bg-stone-200'
          }`}
        >
          <Users className="w-4 h-4" />
          {t('all_circles')}
        </button>
        {circles.map((circle) => (
          <button
            key={circle.id}
            onClick={() => setActiveCircleFilter(circle.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeCircleFilter === circle.id
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-stone-500 hover:bg-stone-200'
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

      <div className="flex items-center gap-3">
         {/* Language Switcher */}
         <div className="relative group">
            <button className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors border border-stone-200">
              <Globe className="w-4 h-4" />
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl py-2 hidden group-hover:block border border-stone-100 z-50 animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => changeLanguage('en')} className={`block w-full text-left rtl:text-right px-4 py-2 text-sm ${i18n.language === 'en' ? 'text-orange-600 font-bold bg-orange-50' : 'text-stone-700 hover:bg-stone-50'}`}>English</button>
              <button onClick={() => changeLanguage('he')} className={`block w-full text-left rtl:text-right px-4 py-2 text-sm ${i18n.language === 'he' ? 'text-orange-600 font-bold bg-orange-50' : 'text-stone-700 hover:bg-stone-50'}`}>עברית</button>
              <button onClick={() => changeLanguage('ru')} className={`block w-full text-left rtl:text-right px-4 py-2 text-sm ${i18n.language === 'ru' ? 'text-orange-600 font-bold bg-orange-50' : 'text-stone-700 hover:bg-stone-50'}`}>Русский</button>
            </div>
         </div>

         {/* User Switcher */}
        <div className="relative group z-50">
           <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 overflow-hidden">
                {currentUser.avatar ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" /> : currentUser.name[0]}
             </div>
             <div className="hidden sm:block text-left rtl:text-right">
                <p className="text-xs font-bold text-stone-800 leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-stone-500 leading-none mt-0.5">Switch User</p>
             </div>
             <ChevronDown className="w-3 h-3 text-stone-400" />
           </button>

           <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 hidden group-hover:block border border-stone-100 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">Select User</div>
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => switchUser(user.id)}
                  className={`w-full text-left rtl:text-right px-4 py-2 text-sm flex items-center gap-3 hover:bg-stone-50 transition-colors ${currentUser.id === user.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-stone-600'}`}
                >
                   <div className="w-6 h-6 rounded-full bg-stone-200 overflow-hidden">
                      {user.avatar && <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />}
                   </div>
                   {user.name}
                </button>
              ))}
           </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
