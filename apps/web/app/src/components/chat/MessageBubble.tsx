"use client"
import React from 'react';
import { MessageBubbleProps } from '../../../../types/ChatTypes';

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, senderName }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 shadow ${
          isOwn 
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none' 
            : 'bg-gray-700 text-gray-100 rounded-bl-none'
        }`}
      >
        <div className="flex justify-between items-baseline mb-1">
          <span className={`text-xs font-medium ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
            {isOwn ? 'You' : senderName || 'Unknown User'}
          </span>
          <span className="text-xs opacity-70 ml-2">
            {formatTime(message.timeStamp)}
          </span>
        </div>
        <p className="break-words">{message.message}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
