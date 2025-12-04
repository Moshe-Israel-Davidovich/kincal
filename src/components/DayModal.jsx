import React, { useState } from 'react';
import { format } from 'date-fns';
import { enUS, he, ru } from 'date-fns/locale';
import { X, Calendar, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const DayModal = ({ date, onClose }) => {
  const { getDayContent, circles, addEvent, addPhoto, deleteEvent, deletePhoto } = useAppContext();
  const { events, photos } = getDayContent(date);
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'gallery', 'add'
  const { t, i18n } = useTranslation();
  
  const getLocale = () => {
    switch (i18n.language) {
      case 'he': return he;
      case 'ru': return ru;
      default: return enUS;
    }
  };
  const locale = getLocale();

  const [formType, setFormType] = useState('event');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedCircle, setSelectedCircle] = useState(circles[1].id);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (formType === 'event') {
      addEvent({ title, description: desc, date: date, circleId: selectedCircle });
    } else {
      addPhoto({ url: photoUrl || `https://picsum.photos/seed/${Math.random()}/800/600`, caption: title, date: date, circleId: selectedCircle });
    }
    setTitle('');
    setDesc('');
    setPhotoUrl('');
    setActiveTab(formType === 'event' ? 'events' : 'gallery');
  };

  const getCircleName = (id) => {
    if (id === '1') return t('circle_couple');
    if (id === '2') return t('circle_nuclear');
    if (id === '3') return t('circle_extended');
    const c = circles.find(c => c.id === id);
    return c ? c.name : id;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-white/20 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-white border-b border-stone-100 p-5 flex items-center justify-between sticky top-0 z-10">
          <div>
             <h3 className="text-xl font-bold text-stone-800 tracking-tight">
               {format(date, 'EEEE', { locale })}
             </h3>
             <p className="text-stone-500 text-sm font-medium">
               {format(date, 'MMMM do, yyyy', { locale })}
             </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="p-2 bg-stone-50 m-4 rounded-xl flex gap-1 border border-stone-200/50">
          {[
            { id: 'events', label: t('events'), count: events.length },
            { id: 'gallery', label: t('gallery'), count: photos.length },
            { id: 'add', label: t('add_new'), icon: Plus }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                ${activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-stone-200'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
                }
              `}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label} {tab.count !== undefined && <span className="opacity-60 font-normal">({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 px-6 pb-6 bg-white custom-scrollbar">
          
          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-stone-400 space-y-2">
                  <Calendar className="w-10 h-10 opacity-20" />
                  <p>{t('no_events')}</p>
                </div>
              ) : (
                events.map(event => (
                  <div key={event.id} className="group p-4 bg-white border border-stone-200 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all relative">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-stone-800">{event.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-500 px-2 py-1 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            {getCircleName(event.circleId)}
                        </span>
                        <button
                            onClick={() => deleteEvent(event.id)}
                            className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete Event"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {event.description && <p className="text-sm text-stone-600 mt-2 leading-relaxed">{event.description}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 gap-4">
              {photos.length === 0 ? (
                 <div className="col-span-2 flex flex-col items-center justify-center py-10 text-stone-400 space-y-2">
                  <ImageIcon className="w-10 h-10 opacity-20" />
                  <p>{t('no_photos')}</p>
                </div>
              ) : (
                photos.map(photo => (
                  <div key={photo.id} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-stone-100 aspect-[4/3]">
                    <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 justify-between">
                      <p className="text-white text-xs font-medium truncate w-[85%]">{photo.caption}</p>
                      <button
                            onClick={(e) => { e.stopPropagation(); deletePhoto(photo.id); }}
                            className="p-1.5 text-white/70 hover:text-white hover:bg-red-500/80 rounded-lg transition-all"
                            title="Delete Photo"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ADD NEW TAB */}
          {activeTab === 'add' && (
            <div className="space-y-6 pt-2">
              <div className="flex gap-4 p-1 bg-stone-50 rounded-xl w-fit mx-auto border border-stone-100">
                {['event', 'photo'].map(type => (
                  <label key={type} className={`
                    flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-all
                    ${formType === type ? 'bg-white shadow-sm text-orange-600 font-bold' : 'text-stone-500 hover:text-stone-700'}
                  `}>
                    <input
                      type="radio"
                      name="type"
                      checked={formType === type}
                      onChange={() => setFormType(type)}
                      className="hidden"
                    />
                    <span className="capitalize">{t(type)}</span>
                  </label>
                ))}
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">
                    {formType === 'event' ? t('event_title') : t('caption')}
                  </label>
                  <input 
                    required
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all placeholder-stone-400"
                    placeholder={formType === 'event' ? t('placeholder_event') : t('placeholder_photo')}
                  />
                </div>

                {formType === 'event' && (
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">{t('description')}</label>
                    <textarea 
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all placeholder-stone-400 min-h-[100px]"
                      rows="3"
                    ></textarea>
                  </div>
                )}

                {formType === 'photo' && (
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">{t('photo_url')}</label>
                    <input 
                      type="text" 
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all placeholder-stone-400"
                      placeholder="https://..."
                    />
                    <p className="text-[10px] text-stone-400 pl-1">{t('leave_blank')}</p>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">{t('who_can_see')}</label>
                  <div className="relative">
                    <select
                      value={selectedCircle}
                      onChange={(e) => setSelectedCircle(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all appearance-none"
                    >
                      {circles.map(c => (
                        <option key={c.id} value={c.id}>{getCircleName(c.id)}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-stone-900 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-stone-200 mt-2"
                >
                  {formType === 'event' ? t('add_event_btn') : t('add_photo_btn')}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayModal;
