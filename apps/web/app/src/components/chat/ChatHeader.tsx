// ChatHeader (Updated)
"use client";
import React, { useState } from 'react';
import { Moon, Menu, User, Users } from 'lucide-react';
import { StatusBadge } from './Status';
import { MobileMenu } from './MobileMenu';

interface ChatHeaderProps {
  connected: boolean;
  currentRoomId: string | null;
  userName: string;
  userCount: number;
  onToggleUsersList: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  connected,
  currentRoomId,
  userName,
  userCount,
  onToggleUsersList
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Moon className="text-indigo-400" size={24} />
          <h1 className="font-bold text-xl">NightChat</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <StatusBadge connected={connected} />
          
          {currentRoomId && (
            <div className="bg-indigo-900/50 px-3 py-1 rounded-full flex items-center justify-between min-w-32">
              <div className="flex items-center">
                <Users size={14} className="mr-2" />
                <span className="text-sm">Room: {currentRoomId}</span>
              </div>
              <span
                className="ml-2 text-xs bg-indigo-800 px-2 rounded-full cursor-pointer hover:bg-indigo-700"
                onClick={onToggleUsersList}
              >
                {userCount} online
              </span>

            </div>
          )}
          
          <div className="bg-gray-700 px-3 py-1 rounded-full flex items-center">
            <User size={14} className="mr-2" />
            <span className="text-sm">{userName}</span>
          </div>
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-400 hover:text-white cursor-pointer"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <MobileMenu
          connected={connected}
          currentRoomId={currentRoomId}
          userName={userName}
          userCount={userCount}
        />
      )}
    </header>
  );
};
