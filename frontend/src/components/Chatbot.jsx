import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI Assistant. Ask me 'Which laptop is best for coding?'", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add User Message
    setMessages([...messages, { text: input, sender: "user" }]);
    
    // Simulate Bot Response (Mock AI)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "I am a demo bot. Once connected to the RAG backend, I will recommend products based on your usage!", 
        sender: "bot" 
      }]);
    }, 1000);
    
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
        >
          <MessageSquare className="w-8 h-8" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-black border border-orange-700 w-80 md:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-orange-600 p-4 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> AI Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3 bg-black">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-3 rounded-lg max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-orange-500 text-white self-end' : 'bg-slate-700 text-slate-200 self-start'}`}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-black border-t border-orange-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about laptops..."
              className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button type="submit" className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
