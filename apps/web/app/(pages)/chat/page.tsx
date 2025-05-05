"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWebSocket } from "../../../hooks/useWebSocket";
import ChatRoom from '../../src/Components/ChatRoom';
import RoomSelector from '../../src/Components/RoomSelector';
import { WebSocketMessage } from "../../types/WebSocketTypes";
import { getServerSession } from 'next-auth';

export default function ChatPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomId = searchParams.get('roomId');
    const [userId] = useState(`user-${Math.floor(Math.random() * 10000)}`);
    const [activeRoom, setActiveRoom] = useState<string | null>(roomId);


  const handleJoinRoom = (roomId: string) => {
    router.push(`/chat?roomId=${roomId}`);
    setActiveRoom(roomId);
  };

  
  const handleCreateRoom = () => {
    const newRoomId = `room-${Math.floor(Math.random() * 100000)}`;
    router.push(`/chat?roomId=${newRoomId}`);
    setActiveRoom(newRoomId);
  };

  
  const handleLeaveRoom = () => {
    router.push('/chat');
    setActiveRoom(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-400">Baatein</h1>
          <div className="text-sm text-gray-400">Connected as: {userId}</div>
        </div>
      </header>

      <main className="flex flex-1 container mx-auto p-4">
        {activeRoom ? (
          <ChatRoom roomId={activeRoom} userId={userId} onLeave={handleLeaveRoom} />
        ) : (
          <RoomSelector onJoin={handleJoinRoom} onCreate={handleCreateRoom} />
        )}
      </main>
      
      <footer className="bg-gray-800 border-t border-gray-700 p-3 text-center text-sm text-gray-500">
        Real-time WebSocket Chat - {new Date().getFullYear()}
      </footer>
    </div>
  );
}