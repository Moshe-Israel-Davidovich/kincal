import React, { useState } from 'react';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, format, isSameMonth, isToday 
} from 'date-fns';
import { enUS, he, ru } from 'date-fns/locale';
import { useAppContext } from '../context/AppContext';
import { Calendar as CalendarIcon, Image as ImageIcon } from 'lucide-react';
import DayModal from './DayModal';
import { useTranslation } from 'react-i18next';

const CalendarGrid = () => {
  const { selectedDate, getDayContent } = useAppContext();
  const [modalDate, setModalDate] = useState(null);
  const { t, i18n } = useTranslation();

  // Map i18n language to date-fns locale
  const getLocale = () => {
    switch (i18n.language) {
      case 'he': return he;
      case 'ru': return ru;
      default: return enUS;
    }
  };
  const locale = getLocale();

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale });
  const endDate = endOfWeek(monthEnd, { locale });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Generate week days dynamically based on locale
  const weekDays = [];
  const weekStart = startOfWeek(new Date(), { locale });
  for (let i = 0; i < 7; i++) {
    weekDays.push(format(eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart, { locale }) })[i], 'eee', { locale }));
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          {format(selectedDate, 'MMMM yyyy', { locale })}
        </h2>
        {/* Simple Navigation controls could go here (prev/next month), 
            but keeping MVP simple based on prompt */}
      </div>

      <div className="grid grid-cols-7 gap-1 lg:gap-2">
        {weekDays.map(day => (
          <div key={day} className="text-center font-semibold text-slate-500 py-2 capitalize">
            {day}
          </div>
        ))}

        {calendarDays.map(day => {
          const { events, photos } = getDayContent(day);
          const hasPhoto = photos.length > 0;
          const bgPhoto = hasPhoto ? photos[0].url : null;
          
          return (
            <div
              key={day.toString()}
              onClick={() => setModalDate(day)}
              className={`
                aspect-square border rounded-lg p-1 relative cursor-pointer hover:shadow-md transition-shadow
                ${!isSameMonth(day, monthStart) ? 'bg-slate-50 text-slate-400' : 'bg-white text-slate-800'}
                ${isToday(day) ? 'ring-2 ring-orange-500' : 'border-slate-200'}
                overflow-hidden
              `}
            >
              {/* Photo Background Mode */}
              {hasPhoto && (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${bgPhoto})` }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              )}

              <div className="relative z-10 h-full flex flex-col">
                <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-orange-500 text-white' : hasPhoto ? 'text-white' : ''}`}>
                  {format(day, 'd')}
                </span>

                <div className="flex-1 mt-1 space-y-1 overflow-hidden">
                  {events.slice(0, 3).map(event => (
                    <div 
                      key={event.id}
                      className={`text-xs truncate px-1 rounded ${hasPhoto ? 'bg-white/90 text-slate-800' : 'bg-indigo-100 text-indigo-700'}`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {events.length > 3 && (
                     <div className={`text-[10px] ${hasPhoto ? 'text-white' : 'text-slate-500'}`}>+{events.length - 3} {t('more_items')}</div>
                  )}
                </div>

                {hasPhoto && (
                  <div className="absolute bottom-1 right-1 rtl:right-auto rtl:left-1 text-white/80">
                    <ImageIcon className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalDate && (
        <DayModal date={modalDate} onClose={() => setModalDate(null)} />
      )}
    </div>
  );
};

export default CalendarGrid;
