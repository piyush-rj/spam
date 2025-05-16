"use client";

import { useState, useEffect } from "react";

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
  users: User[];
}

export default function ChatPanel({ groupId, groupName, users }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    // Dummy initial messages
    {
      id: "m1",
      sender: { id: "u1", name: "Alice" },
      content: "Welcome to the chat!",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // This would be replaced with actual socket or API logic
  function handleSendMessage() {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `m${Date.now()}`,
      sender: { id: "u_current", name: "You" },
      content: newMessage.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
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
              {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
