"use client";

import { useSessionStore } from "@/app/zustand/atoms/zustand";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  groupId: string;
  groupName: string;

  sendMessage: (type: string, payload: any) => void;
  useSubscribe: (type: string, handler: (payload: any) => void) => void;
  subscribeToRoom: (roomId: string) => void;
  unsubscribeFromRoom: (roomId: string) => void;
  isReady: boolean;
  connectionState: "connected" | "reconnecting" | "connecting" | "disconnected";
}

export default function ChatPanel({
  groupId,
  groupName,
  sendMessage,
  useSubscribe,
  subscribeToRoom,
  unsubscribeFromRoom,
  isReady,
  connectionState,
}: ChatPanelProps) {


  const { session } = useSessionStore();
  if (!session?.user?.id || !session.user.name) {
    console.log("Invalid user session");
    return <div>Please log in to chat.</div>;
  }

  const currentUser: User = {
    id: session.user.id,
    name: session.user.name,
  };

  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Join room on mount
    subscribeToRoom(groupId);
    sendMessage("chat:join", {
      roomId: groupId,
      user: currentUser.id,
    });

    // Leave room on unmount
    return () => {
      sendMessage("chat:leave", {
        roomId: groupId,
        userId: currentUser.id,
      });
      unsubscribeFromRoom(groupId);
    };
  }, [groupId, currentUser.id, currentUser.name]);

  // Subscribe to message events
  useSubscribe("chat:message", (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  });

  // Subscribe to users list update event
  useSubscribe("chat:users", (updatedUsers: User[]) => {
    setUsers(updatedUsers);
  });

  // Subscribe to user joined event
  useSubscribe("chat:user:joined", (user: User) => {
    setUsers((prev) => {
      if (prev.find((u) => u.id === user.id)) return prev;
      return [...prev, user];
    });
  });

  // Subscribe to user left event
  useSubscribe("chat:user:left", (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `m${Date.now()}`,
      sender: currentUser,
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    sendMessage("chat:message", {
      roomId: groupId,
      message,
    });

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  if (!isReady) {
    return <div className="p-4 text-center text-gray-400">Connecting...</div>;
  }

  if (connectionState !== "connected") {
    return (
      <div className="p-4 text-center text-yellow-400">
        Connection status: {connectionState}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="border-b border-gray-700 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{groupName}</h2>
        <div className="text-sm text-gray-400">
          {users.length} user{users.length !== 1 ? "s" : ""}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1a1a1a]">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            <div className="text-sm text-gray-300 font-semibold">{msg.sender.name}</div>
            <div className="text-white">{msg.content}</div>
            <div className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 border-t border-gray-700 flex gap-2"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 rounded-md bg-[#222] border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </form>

      <footer className="p-4 border-t border-gray-700 text-sm text-gray-400">
        Users in this group:
        <ul className="mt-1 list-disc list-inside">
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
