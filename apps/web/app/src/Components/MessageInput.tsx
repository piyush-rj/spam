"use client"
import { useState } from 'react';

export default function MessageInput({ onSend }: { onSend: (msg: string) => void }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 rounded-lg bg-[#333] text-white"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white font-medium"
      >
        Send
      </button>
    </div>
  );
}
