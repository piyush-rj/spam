"use client";
import React from 'react';
import { LogIn, LogOut } from 'lucide-react';

interface RoomControlProps {
  connected: boolean;
  currentRoomId: string | null;
  roomId: string;
  setRoomId: (value: string) => void;
  onJoin: () => void;
  onLeave: () => void;
}

export const RoomControl: React.FC<RoomControlProps> = ({
  connected,
  currentRoomId,
  roomId,
  setRoomId,
  onJoin,
  onLeave
}) => {
  if (currentRoomId) {
    return (
      <div className="flex justify-between items-center">
        <div className="text-sm">
          Currently in room: <span className="font-semibold text-indigo-400">{currentRoomId}</span>
        </div>
        <button 
          onClick={onLeave}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center text-sm"
        >
          <LogOut size={16} className="mr-1" />
          Leave Room
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex space-x-2">
      <input
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onJoin()}
        className="flex-1 bg-gray-700 text-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button 
        onClick={onJoin}
        disabled={!connected || !roomId.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded flex items-center justify-center transition-colors"
      >
        <LogIn size={18} className="mr-2" />
        Join Room
      </button>
    </div>
  );
};