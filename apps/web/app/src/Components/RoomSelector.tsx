"use client";

import { useState } from 'react';
import { MessageSquare, Plus, ArrowRight } from 'lucide-react';

interface RoomSelectorProps {
  onJoin: (roomId: string) => void;
  onCreate: () => void;
}

export default function RoomSelector({ onJoin, onCreate }: RoomSelectorProps) {
  const [roomInput, setRoomInput] = useState('');
  const [recentRooms, setRecentRooms] = useState<string[]>(() => {
    // Get recent rooms from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentChatRooms');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Handle joining a room
  const handleJoinRoom = () => {
    if (roomInput.trim()) {
      // Save to recent rooms
      const updatedRooms = [roomInput, ...recentRooms.filter(r => r !== roomInput)].slice(0, 5);
      setRecentRooms(updatedRooms);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentChatRooms', JSON.stringify(updatedRooms));
      }
      
      onJoin(roomInput);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-full border border-gray-700 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex bg-indigo-900/30 p-3 rounded-full mb-4">
            <MessageSquare size={32} className="text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Join a Chat Room</h2>
          <p className="text-gray-400">Enter a room ID to join an existing room or create a new one</p>
        </div>
        
        <div className="space-y-6">
          {/* Join room */}
          <div className="space-y-3">
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-300">
              Room ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="roomId"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                placeholder="Enter room ID"
                className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
              />
              <button
                onClick={handleJoinRoom}
                disabled={!roomInput.trim()}
                className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Create new room */}
          <div className="flex justify-center">
            <span className="text-gray-500 px-4">or</span>
          </div>
          
          <button
            onClick={onCreate}
            className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            <Plus size={16} />
            <span>Create a new room</span>
          </button>
        </div>
      </div>
      
      {/* Recent rooms */}
      {recentRooms.length > 0 && (
        <div className="mt-6 w-full">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Rooms</h3>
          <div className="space-y-2">
            {recentRooms.map((room) => (
              <button
                key={room}
                onClick={() => onJoin(room)}
                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center">
                  <MessageSquare size={16} className="text-indigo-400 mr-2" />
                  <span className="text-gray-300">{room}</span>
                </div>
                <ArrowRight size={16} className="text-gray-500" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}