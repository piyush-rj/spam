"use client";

import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { WebSocketMessage, WebSocketType } from "../../types/WebSocketTypes";
import { ArrowLeftCircle, Send, UserCircle, Users, Loader } from 'lucide-react';

interface ChatRoomProps {
  roomId: string;
  userId: string;
  onLeave: () => void;
}

export default function ChatRoom({ roomId, userId, onLeave }: ChatRoomProps) {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [participants, setParticipants] = useState<Set<string>>(new Set([userId]));
  
  const {
    status,
    messages,
    sendMessage,
    isConnected,
    subscribedRooms
  } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080',
    roomId,
    autoConnect: true,
    autoSubscribe: true,
    onMessage: (message: WebSocketMessage) => {
      if (message.type === WebSocketType.chat) {
        // Type guard to ensure we can access payload
        const chatMessage = message as Extract<WebSocketMessage, { type: WebSocketType.chat }>;
        if (chatMessage.payload?.senderId) {
          // Add sender to participants list if not already there
          setParticipants(prev => new Set([...prev, chatMessage.payload.senderId as string]));
        }
      }
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input field when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle sending a message
  const handleSend = () => {
    if (messageText.trim() && isConnected) {
      sendMessage(roomId, messageText, userId);
      setMessageText('');
    }
  };

  // Filter messages for the current room
  const roomMessages = messages.filter(msg => 
    msg.roomId === roomId && msg.type === WebSocketType.chat
  ) as Extract<WebSocketMessage, { type: WebSocketType.chat }>[];

  return (
    <div className="flex flex-col w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      {/* Room header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center">
          <button 
            onClick={onLeave}
            className="mr-3 text-gray-400 hover:text-indigo-400 transition-colors"
            aria-label="Leave room"
          >
            <ArrowLeftCircle size={20} />
          </button>
          <div>
            <h2 className="font-semibold text-lg text-indigo-300">{roomId}</h2>
            <div className="flex items-center text-sm text-gray-400">
              <Users size={14} className="mr-1" />
              <span>{participants.size} participants</span>
            </div>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-indigo-400">
          {status === 'connected' ? 'Connected' : status}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {roomMessages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 text-center">
            <div>
              <p className="mb-2">No messages yet</p>
              <p className="text-sm">Be the first to send a message in this room!</p>
            </div>
          </div>
        )}
        
        {roomMessages.map((msg, i) => {
          const isMine = msg.payload.senderId === userId;
          return (
            <div 
              key={i} 
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-md px-4 py-2 rounded-lg ${
                  isMine 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-gray-800 text-gray-200 rounded-bl-none'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <UserCircle size={14} />
                  <span className="text-xs font-medium">
                    {String(msg.payload.senderId) === userId ? 'You' : String(msg.payload.senderId)}
                  </span>
                  <span className="text-xs opacity-70">
                    {msg.payload.timeStamp && new Date(msg.payload.timeStamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p>{String(msg.payload.message)}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!isConnected}
          />
          <button
            onClick={handleSend}
            disabled={!isConnected || !messageText.trim()}
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'connecting' ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        {status !== 'connected' && (
          <p className="mt-2 text-xs text-orange-400">
            {status === 'connecting' 
              ? 'Connecting to server...' 
              : 'Disconnected from server. Messages cannot be sent.'}
          </p>
        )}
      </div>
    </div>
  );
}