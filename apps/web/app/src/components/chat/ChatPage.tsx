"use client";
import { useSession } from "next-auth/react";
import { useWebSocket } from "../../../../hooks/useWebSocket";
import { ChatLayout } from "./ChatLayout";
import { User } from "lucide-react";

export default function ChatPage() {
  const { data: session } = useSession();
  
  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl text-gray-100 font-medium">User not found</h2>
          <p className="text-gray-400 mt-2">Please sign in to continue</p>
        </div>
      </div>
    );
  }

  const userId = session.user.id;
  const userName = session.user.fullName || "Anonymous";

  const {
    connected,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    currentRoomId,
    userCount 
  } = useWebSocket(userId);

  return (
    <ChatLayout
      userId={userId}
      userName={userName}
      connected={connected}
      messages={messages}
      userCount={userCount}
      currentRoomId={currentRoomId}
      onJoinRoom={joinRoom}
      onLeaveRoom={leaveRoom}
      onSendMessage={sendMessage}
    />
  );
}
