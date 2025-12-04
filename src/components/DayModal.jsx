import React, { useState } from 'react';
import { format } from 'date-fns';
import { X, Calendar, Image as ImageIcon, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const DayModal = ({ date, onClose }) => {
  const { getDayContent, circles, addEvent, addPhoto } = useAppContext();
  const { events, photos } = getDayContent(date);
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'gallery', 'add'
  
  // Form State
  const [formType, setFormType] = useState('event'); // 'event' or 'photo'
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [photoUrl, setPhotoUrl] = useState(''); // Simple URL input for MVP
  const [selectedCircle, setSelectedCircle] = useState(circles[1].id); // Default to Nuclear

  const handleAddSubmit = (e) => {
    e.preventDefault();
    
    if (formType === 'event') {
      addEvent({
        title,
        description: desc,
        date: date,
        circleId: selectedCircle,
      });
    } else {
      addPhoto({
        url: photoUrl || `https://picsum.photos/seed/${Math.random()}/800/600`, // Fallback for demo
        caption: title,
        date: date,
        circleId: selectedCircle,
      });
    }
    
    // Reset and go back to list
    setTitle('');
    setDesc('');
    setPhotoUrl('');
    setActiveTab(formType === 'event' ? 'events' : 'gallery');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            {format(date, 'EEEE, MMMM do, yyyy')}
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
            Events ({events.length})
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'gallery' ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
          >
            Gallery ({photos.length})
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'add' ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
          >
            <span className="flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" /> Add New
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          
          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="text-center text-slate-400 py-8">No events scheduled for this day.</div>
              ) : (
                events.map(event => (
                  <div key={event.id} className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-indigo-900">{event.title}</h4>
                      <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">
                        {circles.find(c => c.id === event.circleId)?.name}
                      </span>
                    </div>
                    {event.description && <p className="text-sm text-indigo-700 mt-1">{event.description}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 gap-3">
              {photos.length === 0 ? (
                <div className="col-span-2 text-center text-slate-400 py-8">No photos for this day.</div>
              ) : (
                photos.map(photo => (
                  <div key={photo.id} className="group relative rounded-lg overflow-hidden border border-slate-200">
                    <img src={photo.url} alt={photo.caption} className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-white text-xs truncate w-full">{photo.caption}</p>
                    </div>
                    <div className="absolute top-1 right-1">
                       <span className="text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                        {circles.find(c => c.id === photo.circleId)?.name}
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
                  <span className="text-sm font-medium text-slate-700">Event</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    checked={formType === 'photo'} 
                    onChange={() => setFormType('photo')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Photo</span>
                </label>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {formType === 'event' ? 'Event Title' : 'Caption'}
                  </label>
                  <input 
                    required
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder={formType === 'event' ? "e.g., Dinner at Mom's" : "e.g., Fun at the park"}
                  />
                </div>

                {formType === 'event' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea 
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      rows="3"
                    ></textarea>
                  </div>
                )}

                {formType === 'photo' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Photo URL</label>
                    <input 
                      type="text" 
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-slate-400 mt-1">Leave blank for a random placeholder.</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Who can see this?</label>
                  <select 
                    value={selectedCircle}
                    onChange={(e) => setSelectedCircle(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  >
                    {circles.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-orange-600 text-white font-semibold py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {formType === 'event' ? 'Add Event' : 'Add Photo'}
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
