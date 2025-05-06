'use client';

import { useState } from 'react';
import { useWebSocket } from '../../../hooks/useWebSocket'; 
import { WebSocketType } from '../../../types/WebSocketTypes';
import { WebSocketMessage } from '../../types/WebSocketTypes';

export default function Chat() {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [inputMsg, setInputMsg] = useState('');
  const [joined, setJoined] = useState(false);

  const {
    status,
    messages,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendMessage,
    isConnected,
  } = useWebSocket({
    url: 'http://localhost:8080',
    autoConnect: true,
    autoSubscribe: false,
    onMessage: (msg) => console.log('Message received:', msg),
  });

  const handleJoin = () => {
    if (roomId && isConnected) {
      subscribe(roomId);
      setJoined(true);
    }
  };

  const handleLeave = () => {
    if (roomId && isConnected) {
      unsubscribe(roomId);
      setJoined(false);
    }
  };

  const handleSend = () => {
    if (roomId && inputMsg && userId) {
      sendMessage(roomId, inputMsg, userId);
      setInputMsg('');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>WebSocket Chat</h1>

      <div style={styles.inputGroup}>
        <input
          style={styles.input}
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button style={styles.button} onClick={handleJoin} disabled={!roomId || !userId || joined}>
          Join Room
        </button>
        <button style={styles.button} onClick={handleLeave} disabled={!joined}>
          Leave Room
        </button>
      </div>

      <div style={styles.chatBox}>
      {messages
      .filter((msg) => msg.roomId === roomId && msg.type === WebSocketType.chat)
      .map((msg, idx) => {
        const chatMsg = msg as Extract<WebSocketMessage, { type: WebSocketType.chat }>;
        return (
          <div key={idx} style={styles.chatMsg}>
            <strong>{chatMsg.payload.senderId}:</strong> {chatMsg.payload.message}
          </div>
      );
    })}

      </div>

      <div style={styles.inputGroup}>
        <input
          style={styles.input}
          placeholder="Message"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
        />
        <button style={styles.button} onClick={handleSend} disabled={!joined || !inputMsg}>
          Send
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 14 }}>
        Status: <strong>{status}</strong>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: 20,
    background: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0,0,0,0.4)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    display: 'flex',
    gap: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    border: '1px solid #444',
    background: '#2e2e2e',
    color: '#fff',
  },
  button: {
    padding: '8px 12px',
    background: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  chatBox: {
    background: '#111',
    border: '1px solid #333',
    borderRadius: 4,
    height: '200px',
    overflowY: 'auto',
    padding: 10,
    marginBottom: 10,
  },
  chatMsg: {
    padding: '4px 0',
  },
};
