"use client"
import React, { useState } from 'react';
import { ChatContainerProps } from '../../../../types/ChatTypes';
import RoomHeader from './RoomHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';

const ChatContainer: React.FC<ChatContainerProps> = ({
  roomId,
  messages,
  users,
  userCount,
  currentUserId,
  onSendMessage,
  onLeaveRoom
}) => {
  const [showUsersList, setShowUsersList] = useState(false);

  const toggleUsersList = () => {
    setShowUsersList(!showUsersList);
  };

  return (
    <div className="flex-1 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <RoomHeader 
          roomId={roomId} 
          userCount={userCount} 
          onToggleUsersList={toggleUsersList} 
          onLeaveRoom={onLeaveRoom} 
        />
        
        <MessageList 
          messages={messages} 
          users={users} 
          currentUserId={currentUserId} 
        />
        
        <MessageInput 
          onSendMessage={onSendMessage} 
        />
      </div>
      
      {/* Users List Sidebar */}
      {showUsersList && (
        <UserList 
          users={users} 
          currentUserId={currentUserId} 
        />
      )}
    </div>
  );
};

export default ChatContainer;