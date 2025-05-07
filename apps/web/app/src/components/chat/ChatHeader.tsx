"use client"
import React from 'react';
import { AppHeaderProps } from '../../../../types/ChatTypes';

const ChatHeader: React.FC<AppHeaderProps> = ({ 
  connected, 
  userName, 
  userAvatar, 
  isAuthenticated 
}) => {
  return (
    <header className="bg-gray-800 p-4 shadow-lg border-b border-gray-700">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">NightChat</h1>
        
        <div className="flex items-center gap-3">
          {connected ? (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <span className="text-sm text-green-500">Connected</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-red-500 rounded-full"></span>
              <span className="text-sm text-red-500">Disconnected</span>
            </span>
          )}
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {userAvatar && (
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="h-8 w-8 rounded-full border border-gray-600" 
                />
              )}
              <span className="text-sm font-medium">{userName}</span>
            </div>
          ) : (
            <span className="text-sm font-medium text-gray-400">Guest User</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;