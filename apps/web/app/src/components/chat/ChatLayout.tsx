"use client";
import React, { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { RoomControl } from './RoomControl';
import { WebSocketMessage, WebSocketType } from '../../../../types/WebSocketTypes';
import { UsersList } from './UserList';

interface ChatLayoutProps {
  userId: string;
  userName: string;
  connected: boolean;
  messages: WebSocketMessage[];
  userCount: number;
  currentRoomId: string | null;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
  onSendMessage: (text: string) => void;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  userId,
  userName,
  connected,
  messages,
  userCount,
  currentRoomId,
  onJoinRoom,
  onLeaveRoom,
  onSendMessage
}) => {
  const [roomId, setRoomId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [usersListOpen, setUsersListOpen] = useState(false); // Manage the open/close state of the user list

  // Extract users only from userUpdate messages
  const users = messages
    .filter((msg) => msg.type === WebSocketType.userUpdate) // Filter for user-update messages
    .flatMap((msg) => msg.payload.users || []) // Flatten the users array from the payload
    .filter((user, index, self) => 
      self.findIndex(u => u.userId === user.userId) === index // Remove duplicates based on userId
    );

  const handleJoin = () => {
    if (roomId.trim()) onJoinRoom(roomId.trim());
  };

  const handleLeave = () => {
    onLeaveRoom();
  };

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText("");
    }
  };

  const toggleUsersList = () => {
    setUsersListOpen((prev) => !prev); // Toggle the visibility of the users list
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      <ChatHeader
        connected={connected}
        currentRoomId={currentRoomId}
        userName={userName}
        userCount={userCount}
        onToggleUsersList={toggleUsersList} // Pass the toggle function here
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700">
          <ChatMessages
            messages={messages}
            currentRoomId={currentRoomId}
            currentUserId={userId}
          />
        </div>

        {/* Room controls */}
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <RoomControl
            connected={connected}
            currentRoomId={currentRoomId}
            roomId={roomId}
            setRoomId={setRoomId}
            onJoin={handleJoin}
            onLeave={handleLeave}
          />
        </div>

        {/* Message input */}
        <ChatInput
          messageText={messageText}
          setMessageText={setMessageText}
          onSend={handleSend}
          currentRoomId={currentRoomId}
        />
      </div>

      {/* Optionally render the UsersList component */}
      {usersListOpen && (
        <UsersList
          users={users}  // Now passing actual users data
          currentUserId={userId}
          isOpen={usersListOpen}
          onClose={toggleUsersList}
        />
      )}
    </div>
  );
};
