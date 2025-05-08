"use client"
import React, { useEffect, useRef } from 'react';
import { WebSocketMessage, WebSocketType, User } from '../../../../types/WebSocketTypes';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: WebSocketMessage[];
  users: User[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, users, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isOwnMessage = (senderId: string) => {
    return senderId === currentUserId;
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.userId === userId)?.userName || 'Unknown User';
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-gray-900 to-gray-800">
      {messages.filter(msg => msg.type === WebSocketType.chat).map((msg, index) => {
        const messagePayload = msg.payload;
        return (
          <MessageBubble
            key={index}
            message={messagePayload}
            isOwn={isOwnMessage(messagePayload.senderId)}
            senderName={getUserName(messagePayload.senderId)}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;