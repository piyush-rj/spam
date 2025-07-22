import { WebSocketClient } from "@/lib/socket.front";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface WebSocketState {
    wsClient: WebSocketClient | null;
    isConnected: boolean;
    connect: (url: string) => Promise<void>;
    disconnect: () => void;
    setConnected: (connected: boolean) => void;
}


export const useWebSocket = create<WebSocketState>()(
    devtools((set, get) => ({
        wsClient: null,
        isConnected: false,

        connect: async (url: string) => {
            const client = new WebSocketClient(url);

            client.onConnection((connected) => {
                set({ isConnected: connected });
            });

            await client.connect();

            set({ wsClient: client });
        },

        disconnect: () => {
            const client = get().wsClient;
            if (client) {
                client.disconnect();
                set({ wsClient: null, isConnected: false });
            }
        },

        setConnected: (connected: boolean) => {
            set({ isConnected: connected });
        },
    }))
);
