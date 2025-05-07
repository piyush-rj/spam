"use client";
import React, { useEffect, useRef } from 'react';
import { Users } from 'lucide-react';
import { WebSocketMessage } from '../../../../types/WebSocketTypes';

interface ChatMessagesProps {
  messages: WebSocketMessage[];
  currentRoomId: string | null;
  currentUserId: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentRoomId,
  currentUserId
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Debug logging
  useEffect(() => {
    console.log("ChatMessages component received:", {
      messageCount: messages?.length || 0,
      currentRoomId,
      currentUserId
    });
    
    if (messages && messages.length > 0) {
      console.log("First message:", messages[0]);
      console.log("Last message:", messages[messages.length - 1]);
    }
  }, [messages, currentRoomId, currentUserId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Users size={48} className="mb-4 text-gray-600" />
        {currentRoomId ? (
          <>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation in room {currentRoomId}</p>
          </>
        ) : (
          <>
            <p className="text-lg font-medium">Not connected to a room</p>
            <p className="text-sm">Join a room to start chatting</p>
          </>
        )}
      </div>
    );
  }
  
  return (
    <ul className="space-y-3">
      {messages.map((msg, index) => {
        console.log(`Rendering message ${index}:`, msg);
        
        const isChatMessage = 
          msg.type === "chat" || 
          (typeof msg.type === 'object' && msg.type === "chat") ||
          (typeof msg.type === 'string' && msg.type.toLowerCase() === 'chat');
        
        if (isChatMessage && msg.payload) {
          const chatPayload = msg.payload;
          const isCurrentUser = chatPayload.senderId === currentUserId;
          
          // Check if it's a system message (join/leave notification)
          const isSystemMessage = typeof chatPayload.message === 'string' && (
            chatPayload.message.includes("joined the room") || 
            chatPayload.message.includes("left the room")
          );
          
          if (isSystemMessage) {
            return (
              <li key={index} className="text-center my-2">
                <div className="inline-block bg-gray-800 text-gray-400 rounded-full px-3 py-1 text-xs">
                  {chatPayload.message}
                </div>
              </li>
            );
          }
          
          return (
            <li 
              key={index} 
              className={`max-w-3/4 ${isCurrentUser ? 'ml-auto' : 'mr-auto'}`}
            >
              <div 
                className={`rounded-lg px-4 py-2 shadow ${
                  isCurrentUser 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                <div className="flex justify-between items-center mb-1 text-xs opacity-80">
                  <span className="font-semibold">
                    {isCurrentUser ? 'You' : 
                      (chatPayload.senderName || 
                       `User ${chatPayload.senderId.substring(0, 5)}`)}
                  </span>
                  <span>
                    {new Date(chatPayload.timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-wrap break-words">{chatPayload.message}</div>
              </div>
            </li>
          );
        }
        return null;
      })}
      <div ref={messagesEndRef} />
    </ul>
  );
};