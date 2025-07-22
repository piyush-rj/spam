'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/types/socketTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWebSocket } from '@/hooks/zustand';

export default function ChatRoom() {
    const [userId, setUserId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [joined, setJoined] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const { wsClient, connect, disconnect, isConnected } = useWebSocket();



    useEffect(() => {
        connect('ws://localhost:8080');

        return () => {
            disconnect();
        };
    }, []);

    useEffect(() => {
        if (!wsClient || !roomId || !userId || !isConnected) return;

        const unsub = wsClient.onMessage(roomId, (message) => {
            if (message.type === 'CHAT') {
                setChatMessages((prev) => [...prev, message]);
            }
        });

        wsClient.subscribe(roomId, userId);

        return () => {
            wsClient.unsubscribe(roomId);
            unsub();
        };
    }, [wsClient, roomId, userId, isConnected]);

    const handleSend = () => {
        if (!message.trim() || !wsClient) return;
        wsClient.sendChat(roomId, userId, message);
        setMessage('');
    };

    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [chatMessages]);

    if (!joined) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <h2 className="text-2xl font-bold">join room</h2>
                <Input
                    placeholder="enter id"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <Input
                    placeholder="enter roomId"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
                <Button onClick={() => setJoined(true)} disabled={!userId || !roomId}>
                    JOIN
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen p-4">
            <h2 className="text-xl font-semibold mb-2">
                Room: <span className="font-mono">{roomId}</span>
            </h2>
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto bg-gray-100 rounded-md p-4 mb-4 shadow-inner"
            >
                {chatMessages.map((msg, idx) => (
                    <Card
                        key={idx}
                        className={`mb-2 w-fit px-3 py-2 ${msg.payload.senderId === userId
                            ? 'ml-auto bg-blue-200'
                            : 'mr-auto bg-white'
                            }`}
                    >
                        <CardContent className="p-0 text-sm">
                            <div className="font-semibold text-xs text-gray-600">
                                {msg.payload.senderId}
                            </div>
                            <div>{msg.payload.message}</div>
                            <div className="text-[10px] text-gray-500 text-right">
                                {msg.payload.timestamp
                                    ? new Date(msg.payload.timestamp).toLocaleTimeString()
                                    : '—'}
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend} disabled={!message.trim()}>
                    Send
                </Button>
            </div>
        </div>
    );
}
