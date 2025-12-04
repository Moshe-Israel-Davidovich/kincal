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
    circles
  } = useAppContext();
  
  const { t, i18n } = useTranslation();
  const [newMessage, setNewMessage] = useState('');

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

  const getCircleName = (id) => {
     if (id === '1') return t('circle_couple');
     if (id === '2') return t('circle_nuclear');
     if (id === '3') return t('circle_extended');
     const circle = circles.find(c => c.id === id);
     return circle ? circle.name : `Circle ${id}`;
  }

  const getTargetCircleName = () => {
    return activeCircleFilter === 'all' ? t('circle_extended') : getCircleName(activeCircleFilter);
  }

  if (!isSidebarOpen) {
    return (
      <div className="hidden lg:flex w-16 bg-white rounded-2xl border border-stone-200 shadow-sm flex-col items-center py-6 gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-3 hover:bg-stone-100 rounded-xl text-stone-500 transition-colors"
        >
          <ChevronLeft className="rtl:rotate-180 transform transition-transform"/>
        </button>
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
          <MessageSquare className="w-5 h-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-80 lg:static lg:w-96 bg-white/80 backdrop-blur-xl lg:bg-white border-l lg:border border-stone-200 lg:rounded-3xl shadow-2xl lg:shadow-sm z-30 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-white/50 rounded-t-3xl">
        <div>
          <h3 className="font-bold text-stone-800 flex items-center gap-2 text-lg">
            {t('family_chat')}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 font-medium">
             {t('posting_to')} <span className="text-orange-600">{getTargetCircleName()}</span>
          </p>
        </div>
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
          <div className="flex flex-col items-center justify-center h-full text-stone-400 space-y-3">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-stone-300" />
            </div>
            <p className="text-sm font-medium">{t('no_messages')}</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser.id;
            const showAvatar = idx === 0 || messages[idx - 1].senderId !== msg.senderId;

            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar Placeholder */}
                <div className={`w-8 h-8 flex-shrink-0 flex items-end ${!showAvatar && 'opacity-0'}`}>
                   {isMe ? (
                     <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">Me</div>
                   ) : (
                     <div className="w-8 h-8 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-xs font-bold text-stone-600">?</div>
                   )}
                </div>

                <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`
                      px-4 py-2.5 text-sm shadow-sm
                      ${isMe
                        ? 'bg-indigo-600 text-white rounded-2xl rounded-br-none rtl:rounded-br-2xl rtl:rounded-bl-none'
                        : 'bg-white text-stone-700 border border-stone-200 rounded-2xl rounded-bl-none rtl:rounded-bl-2xl rtl:rounded-br-none'
                      }
                    `}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1 font-medium">
                    {format(msg.timestamp, 'p', { locale })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-stone-100 rounded-b-3xl">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-stone-100 p-1.5 rounded-full border border-stone-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('type_message')}
            className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:outline-none text-stone-700 placeholder-stone-400"
          />
          <button 
            type="submit"
            className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-transform active:scale-95 shadow-md shadow-indigo-200"
          >
            <Send className="w-4 h-4 rtl:rotate-180 ml-0.5 rtl:mr-0.5 rtl:ml-0" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
