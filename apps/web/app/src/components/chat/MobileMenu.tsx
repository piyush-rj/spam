"use client";
import React from 'react';
import { User, Users } from 'lucide-react';
import { StatusBadge } from './Status';

interface MobileMenuProps {
  connected: boolean;
  currentRoomId: string | null;
  userName: string;
  userCount: number;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  connected,
  currentRoomId,
  userName,
  userCount
}) => {
  return (
    <div className="bg-gray-800 px-4 py-2 border-t border-gray-700">
      <div className="flex flex-col space-y-2">
        <StatusBadge connected={connected} />
        
        {currentRoomId && (
          <div className="bg-indigo-900/50 px-3 py-2 rounded flex items-center justify-between">
            <div className="flex items-center">
              <Users size={14} className="mr-2" />
              <span className="text-sm">Room: {currentRoomId}</span>
            </div>
            <span
              className="ml-2 text-xs bg-indigo-800 px-2 rounded-full cursor-pointer hover:bg-indigo-700"
              onClick={() => alert(`${userCount} users online`)} // Replace with actual toggle
            >
              {userCount} online
            </span>

          </div>
        )}
        
        <div className="bg-gray-700 px-3 py-2 rounded flex items-center">
          <User size={14} className="mr-2" />
          <span className="text-sm">{userName}</span>
        </div>
      </div>
    </div>
  );
};
