"use client"
import React, { useState } from 'react';
import { MessageInputProps } from '../../../../types/ChatTypes';

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [messageInput, setMessageInput] = useState<string>('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      <div className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1 px-4 py-2 rounded-full bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 disabled:opacity-50"
        />
        <button
          onClick={handleSendMessage}
          disabled={!messageInput.trim() || disabled}
          className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full flex items-center justify-center transition-all ${
            !messageInput.trim() || disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;