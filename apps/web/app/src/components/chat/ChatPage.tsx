"use client"
import React from 'react';
import { useSession } from 'next-auth/react';
import { useWebSocket } from '../../../../hooks/useWebSocket';
import JoinRoom from '../chat/JoinRoom';
import ChatContainer from '../chat/ChatContainer';
import ChatHeader from '../chat/ChatHeader';
import ParticleBackground from '../Dashboard/ui/ParticleBackground';

const ChatApp: React.FC = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  
  const userId = session?.user?.id || 'guest-' + Math.random().toString(36).substring(2, 10);
  const userName = session?.user?.fullName || 'Guest User';
  const userAvatar = session?.user?.image || null;
  
  const {
    connected,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    currentRoomId,
    userCount,
    users,
    currentUser
  } = useWebSocket({
    userId,
    userName
  });

  return (
    <div className="flex flex-col mt-20 h-screen bg-black text-gray-100 ">
      <ParticleBackground/>
      <p className='flex z-20'>{JSON.stringify(session)}</p>
      <ChatHeader
        connected={connected}
      />
      
      <div className="flex-1 flex h-full z-10">
        {!currentRoomId ? (
          <JoinRoom onJoinRoom={joinRoom} isConnected={connected} />
        ) : (
          <ChatContainer
            roomId={currentRoomId}
            messages={messages}
            users={users}
            userCount={userCount}
            currentUserId={userId}
            onSendMessage={sendMessage}
            onLeaveRoom={leaveRoom}
          />
        )}
      </div>
    </div>
  );
};

export default ChatApp;