"use client"
import { useState } from 'react';

type Props = {
  currentRoom: string | null;
  onJoin: (roomId: string) => void;
  onLeave: (roomId: string) => void;
};

export default function RoomList({ currentRoom, onJoin, onLeave }: Props) {
  const [roomInput, setRoomInput] = useState('');

  return (
    <div className="w-full max-w-md bg-[#1a1a1a] p-4 rounded-xl shadow mb-6">
      <input
        type="text"
        placeholder="Enter room ID"
        className="w-full mb-3 px-4 py-2 rounded-lg bg-[#2a2a2a] text-white"
        value={roomInput}
        onChange={(e) => setRoomInput(e.target.value)}
      />
      <div className="flex space-x-3">
        <button
          onClick={() => {
            if (roomInput) onJoin(roomInput);
          }}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-lg py-2"
        >
          Join
        </button>
        <button
          onClick={() => {
            if (roomInput) onLeave(roomInput);
          }}
          className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-lg py-2"
        >
          Leave
        </button>
      </div>
      {currentRoom && <p className="mt-3 text-sm text-gray-400">Currently in: {currentRoom}</p>}
    </div>
  );
}
