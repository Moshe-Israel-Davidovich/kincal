import React, { useState } from 'react';
import { format } from 'date-fns';
import { enUS, he, ru } from 'date-fns/locale';
import { X, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const DayModal = ({ date, onClose }) => {
  const { getDayContent, circles, addEvent, addPhoto } = useAppContext();
  const { events, photos } = getDayContent(date);
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'gallery', 'add'
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

  // Form State
  const [formType, setFormType] = useState('event'); // 'event' or 'photo'
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
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            {format(date, 'EEEE, MMMM do, yyyy', { locale })}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'events' ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
          >
            {t('events')} ({events.length})
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'gallery' ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
          >
            {t('gallery')} ({photos.length})
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'add' ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
          >
            <span className="flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" /> {t('add_new')}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 px-6 pb-6 bg-white custom-scrollbar">
          
          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="text-center text-slate-400 py-8">{t('no_events')}</div>
              ) : (
                events.map(event => (
                  <div key={event.id} className="group p-4 bg-white border border-stone-200 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-indigo-900">{event.title}</h4>
                      <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">
                        {getCircleName(event.circleId)}
                      </span>
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
                <div className="col-span-2 text-center text-slate-400 py-8">{t('no_photos')}</div>
              ) : (
                photos.map(photo => (
                  <div key={photo.id} className="group relative rounded-lg overflow-hidden border border-slate-200">
                    <img src={photo.url} alt={photo.caption} className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-white text-xs truncate w-full">{photo.caption}</p>
                    </div>
                    <div className="absolute top-1 right-1 rtl:right-auto rtl:left-1">
                       <span className="text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                        {getCircleName(photo.circleId)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ADD NEW TAB */}
          {activeTab === 'add' && (
            <div className="space-y-4">
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    checked={formType === 'event'} 
                    onChange={() => setFormType('event')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-slate-700">{t('event')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    checked={formType === 'photo'} 
                    onChange={() => setFormType('photo')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-slate-700">{t('photo')}</span>
                </label>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {formType === 'event' ? t('event_title') : t('caption')}
                  </label>
                  <input 
                    required
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder={formType === 'event' ? t('placeholder_event') : t('placeholder_photo')}
                  />
                </div>

                {formType === 'event' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('description')}</label>
                    <textarea 
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all placeholder-stone-400 min-h-[100px]"
                      rows="3"
                    ></textarea>
                  </div>
                )}

                {formType === 'photo' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('photo_url')}</label>
                    <input 
                      type="text" 
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all placeholder-stone-400"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-slate-400 mt-1">{t('leave_blank')}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('who_can_see')}</label>
                  <select 
                    value={selectedCircle}
                    onChange={(e) => setSelectedCircle(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  >
                    {circles.map(c => (
                      <option key={c.id} value={c.id}>{getCircleName(c.id)}</option>
                    ))}
                  </select>
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
