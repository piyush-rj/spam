"use client"
import React from 'react';
import { AppHeaderProps } from '../../../../types/ChatTypes';

const ChatHeader: React.FC<AppHeaderProps> = ({ 
  connected, 

}) => {
  return (
    <header className=" z-10 p-2 pl-8 shadow-lg">

        
        <div className="flex items-center gap-3">
          {connected ? (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-500">Connected</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-red-500">Disconnected</span>
            </span>
          )}

        </div>
    </header>
  );
};

export default ChatHeader;