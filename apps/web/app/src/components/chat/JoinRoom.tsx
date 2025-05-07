"use client"
import React, { useState } from 'react';
import { JoinRoomProps } from '../../../../types/ChatTypes';

const JoinRoom: React.FC<JoinRoomProps> = ({ onJoinRoom, isConnected }) => {
  const [roomInput, setRoomInput] = useState<string>('');

  const handleJoinRoom = () => {
    if (roomInput.trim()) {
      onJoinRoom(roomInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
        <h2 className="text-xl font-bold mb-6 text-center">Join a Chat Room</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Room ID</label>
            <input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter room ID"
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleJoinRoom}
            disabled={!isConnected}
            className={`w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded font-medium transition-all ${
              !isConnected ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isConnected ? 'Join Room' : 'Connecting...'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
