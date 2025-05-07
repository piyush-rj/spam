"use client";
import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  messageText: string;
  setMessageText: (value: string) => void;
  onSend: () => void;
  currentRoomId: string | null;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  messageText,
  setMessageText,
  onSend,
  currentRoomId
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  
  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      <div className="flex space-x-2">
        <textarea
          placeholder={currentRoomId ? "Type your message..." : "Join a room to start chatting"}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={!currentRoomId}
          className="flex-1 bg-gray-700 text-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-600 disabled:opacity-50 resize-none h-12 max-h-32"
          style={{ minHeight: '48px' }}
        />
        <button 
          onClick={onSend}
          disabled={!currentRoomId || !messageText.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:opacity-50 text-white px-4 rounded flex items-center justify-center transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-1 text-right">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};