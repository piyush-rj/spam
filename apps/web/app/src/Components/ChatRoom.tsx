"use client"
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import { WebSocketMessage } from '../../types/WebSocketTypes';

type Props = {
  roomId: string;
  messages: WebSocketMessage[];
  sendMessage: (roomId: string, message: string, senderId: string) => boolean;
};

export default function ChatRoom({ roomId, messages, sendMessage }: Props) {
  return (
    <section className="w-full max-w-2xl mt-8 bg-[#1e1e1e] rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Room: {roomId}</h2>
      <MessageList messages={messages} />
      <MessageInput
        onSend={(msg) => sendMessage(roomId, msg, 'user-123')}
      />
    </section>
  );
}
