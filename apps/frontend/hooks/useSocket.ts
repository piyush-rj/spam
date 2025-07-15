import { connectSocket } from "@/socket/singleton";
import { useEffect, useRef } from "react";

interface MessageHandlerProps {
    (message: any): void;
}


export function useSocket (onMessage: MessageHandlerProps) {
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = connectSocket();
        socketRef.current = socket;


        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.log("handle message failed")
            }
        }

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage)
        }
    }, [onMessage])


    const sendMessage = (data: object) => {
        if(socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(data));
        } else {
            console.log("sendMessage failed")
        }
    }

    const subscribe = (roomId: string) => {
        sendMessage({ type: "SUBCRIBE", roomId });
    }

    const unsubscribe = (roomId: string) => {
        sendMessage({ type: "UNSUBSCRIBE", roomId });
    }


    return { sendMessage, subscribe, unsubscribe };
}