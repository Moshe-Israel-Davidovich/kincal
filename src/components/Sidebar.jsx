import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { Send, MessageSquare, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Sidebar = () => {
  const { 
    messages, 
    addMessage, 
    activeCircleFilter, 
    currentUser, 
    isSidebarOpen, 
    setIsSidebarOpen 
  } = useAppContext();
  
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // If "All" is selected, default to the most private circle (Couple) or prompt. 
    // For MVP, if "All" is selected, we'll default to Circle 3 (Extended) or just block it.
    // Let's assume default is '3' (Extended) if 'all' is picked, or require selection.
    // Better UX: Show a selector. For now, defaulting to context or asking user.
    // Prompt says: "Messages are also filtered by the selected Circle context."
    // So if I am in "Couple", I send to "Couple". 
    // If I am in "All", where does it go? Let's assume "Extended Family" (3) as a safe default for "Public" 
    // OR disable input if 'all'.
    // Let's go with: if 'all', default to circleId '3' (Extended), otherwise use active filter.
    const targetCircleId = activeCircleFilter === 'all' ? '3' : activeCircleFilter;

    addMessage(newMessage, targetCircleId);
    setNewMessage('');
  };

  if (!isSidebarOpen) {
    return (
      <div className="w-12 bg-white border-l border-slate-200 flex flex-col items-center py-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
        >
          <ChevronLeft />
        </button>
        <div className="mt-4">
          <MessageSquare className="text-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-10 transition-all">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-orange-500" />
          Family Chat
        </h3>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="text-slate-400 hover:text-slate-600"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 text-sm mt-10">
            No messages yet in this circle.
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`
                    max-w-[80%] p-3 rounded-lg text-sm shadow-sm
                    ${isMe ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-200'}
                  `}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[10px] block mt-1 ${isMe ? 'text-orange-100' : 'text-slate-400'}`}>
                    {format(msg.timestamp, 'MMM d, h:mm a')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="text-xs text-slate-400 mb-2">
          Posting to: <span className="font-semibold text-orange-600">
            {activeCircleFilter === 'all' ? 'Extended Family' : `Circle ${activeCircleFilter}`}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
