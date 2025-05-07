"use client"
import React from 'react';
import { RoomHeaderProps } from '../../../../types/ChatTypes';

const RoomHeader: React.FC<RoomHeaderProps> = ({ 
  roomId, 
  userCount, 
  onToggleUsersList, 
  onLeaveRoom 
}) => {
  return (
    <div className="bg-gray-800 p-4 shadow flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-purple-600 h-8 w-8 rounded flex items-center justify-center">
          <span className="font-bold">{roomId.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h2 className="font-medium">Room: {roomId}</h2>
          <p className="text-xs text-gray-400">{userCount} {userCount === 1 ? 'user' : 'users'} online</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleUsersList}
          className="p-2 rounded hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
        
        <button 
          onClick={onLeaveRoom}
          className="p-2 text-red-400 hover:bg-gray-700 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RoomHeader;
