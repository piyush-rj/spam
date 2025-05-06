"use client";
import { WebSocketMessage, WebSocketType } from "../../types/WebSocketTypes";

export default function MessageList({ messages }: { messages: WebSocketMessage[] }) {
  return (
    <div className="h-64 overflow-y-auto mb-4 space-y-2 bg-[#2a2a2a] p-3 rounded-lg">
      {messages.map((msg, i) => {
        if (msg.type === WebSocketType.chat && "payload" in msg && msg.payload) {
          return (
            <div key={i} className="bg-[#3a3a3a] p-2 rounded-lg">
              <span className="text-sm text-gray-300">
                {msg.payload.senderId || 'Anonymous'}:
              </span>
              <p className="text-base text-white">{msg.payload.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.payload.timeStamp).toLocaleTimeString()}
              </p>
            </div>
          );
        }

        return (
          <div key={i} className="text-gray-500 text-xs italic">
            {msg.type === WebSocketType.subscribe
              ? `A user joined room ${msg.roomId}`
              : msg.type === WebSocketType.unsubscribe
              ? `A user left room ${msg.roomId}`
              : null}
          </div>
        );
      })}
    </div>
  );
}
