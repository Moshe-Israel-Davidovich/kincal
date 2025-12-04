import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { enUS, he, ru } from 'date-fns/locale';
import { Send, MessageSquare, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { 
    messages, 
    addMessage, 
    activeCircleFilter, 
    currentUser, 
    isSidebarOpen, 
    setIsSidebarOpen,
    circles // Import circles from context
  } = useAppContext();
  
  const { t, i18n } = useTranslation();
  const [newMessage, setNewMessage] = useState('');

  // Map i18n language to date-fns locale
  const getLocale = () => {
    switch (i18n.language) {
      case 'he': return he;
      case 'ru': return ru;
      default: return enUS;
    }
  };
  const locale = getLocale();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const targetCircleId = activeCircleFilter === 'all' ? '3' : activeCircleFilter;
    addMessage(newMessage, targetCircleId);
    setNewMessage('');
  };

  // Helper to translate default circle names
  const getCircleName = (id) => {
     if (id === '1') return t('circle_couple');
     if (id === '2') return t('circle_nuclear');
     if (id === '3') return t('circle_extended');
     return `Circle ${id}`; // Fallback
  }

  const getTargetCircleName = () => {
    return activeCircleFilter === 'all' ? t('circle_extended') : getCircleName(activeCircleFilter);
  }

  if (!isSidebarOpen) {
    return (
      <div className="w-12 bg-white border-l rtl:border-r rtl:border-l-0 border-slate-200 flex flex-col items-center py-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-3 hover:bg-stone-100 rounded-xl text-stone-500 transition-colors"
        >
          {/* Flip icon for RTL if needed, but ChevronLeft points left (open sidebar from right).
              If sidebar is on right, Left opens it? No, if sidebar is on right, Left closes it usually?
              Wait, sidebar is placed at the end of flex container.
              If LTR: Main - Sidebar. Sidebar on right. ChevronLeft pointing Left means "Expand to Left"? Or "Go Left"?
              Actually, the icon should probably flip based on state.
          */}
          <ChevronLeft className="rtl:rotate-180 transform transition-transform"/>
        </button>
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
          <MessageSquare className="w-5 h-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l rtl:border-r rtl:border-l-0 border-slate-200 flex flex-col h-full shadow-xl z-10 transition-all">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-orange-500" />
          {t('family_chat')}
        </h3>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="text-stone-400 hover:text-stone-600 p-1 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 rtl:rotate-180 transform transition-transform" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-stone-50/30">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 text-sm mt-10">
            {t('no_messages')}
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser.id;
            const showAvatar = idx === 0 || messages[idx - 1].senderId !== msg.senderId;

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`
                    max-w-[80%] p-3 rounded-lg text-sm shadow-sm
                    ${isMe ? 'bg-orange-500 text-white rounded-br-none rtl:rounded-br-lg rtl:rounded-bl-none' : 'bg-white text-slate-700 rounded-bl-none rtl:rounded-bl-lg rtl:rounded-br-none border border-slate-200'}
                  `}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[10px] block mt-1 ${isMe ? 'text-orange-100' : 'text-slate-400'}`}>
                    {format(msg.timestamp, 'MMM d, h:mm a', { locale })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="text-xs text-slate-400 mb-2">
          {t('posting_to')} <span className="font-semibold text-orange-600">
            {getTargetCircleName()}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('type_message')}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button 
            type="submit"
            className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-transform active:scale-95 shadow-md shadow-indigo-200"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
