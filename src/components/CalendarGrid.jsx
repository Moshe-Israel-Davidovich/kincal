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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white/50 rounded-3xl shadow-sm border border-stone-200">
      <div className="p-6 flex items-center justify-between border-b border-stone-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-stone-800 capitalize tracking-tight">
          {format(selectedDate, 'MMMM yyyy', { locale })}
        </h2>
        {/* Navigation could go here */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
        <div className="grid grid-cols-7 gap-3 lg:gap-4 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center font-bold text-stone-400 text-sm uppercase tracking-wider py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3 lg:gap-4 auto-rows-fr">
          {calendarDays.map(day => {
            const { events, photos } = getDayContent(day);
            const hasPhoto = photos.length > 0;
            const bgPhoto = hasPhoto ? photos[0].url : null;
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isDayToday = isToday(day);

            return (
              <div
                key={day.toString()}
                onClick={() => setModalDate(day)}
                className={`
                  aspect-square rounded-2xl p-2 relative cursor-pointer transition-all duration-200 group
                  ${!isCurrentMonth ? 'bg-stone-50/50 text-stone-300' : 'bg-white text-stone-700 shadow-sm hover:shadow-md hover:-translate-y-0.5'}
                  ${isDayToday ? 'ring-2 ring-offset-2 ring-orange-400' : 'border border-stone-100'}
                  overflow-hidden
                `}
              >
                {/* Photo Background Mode */}
                {hasPhoto && (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${bgPhoto})` }}
                  >
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  </div>
                )}

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex justify-between items-start">
                    <span
                      className={`
                        text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full
                        ${isDayToday
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                          : hasPhoto
                            ? 'bg-black/20 text-white backdrop-blur-md'
                            : 'text-stone-700 group-hover:bg-stone-100'
                        }
                      `}
                    >
                      {format(day, 'd')}
                    </span>
                    {hasPhoto && (
                      <div className="text-white/90 drop-shadow-md">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 mt-2 space-y-1.5 overflow-hidden">
                    {events.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        className={`
                          text-[10px] lg:text-xs font-medium truncate px-2 py-0.5 rounded-md
                          ${hasPhoto
                            ? 'bg-white/90 text-stone-800 backdrop-blur-sm shadow-sm'
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          }
                        `}
                      >
                        {event.title}
                      </div>
                    ))}
                    {events.length > 3 && (
                       <div className={`text-[10px] font-medium px-1 ${hasPhoto ? 'text-white drop-shadow-md' : 'text-stone-400'}`}>
                         +{events.length - 3} {t('more_items')}
                       </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalDate && (
        <DayModal date={modalDate} onClose={() => setModalDate(null)} />
      )}
    </div>
  );
};

export default CalendarGrid;
