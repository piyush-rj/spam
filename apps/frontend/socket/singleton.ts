let socket: WebSocket | null = null;

export const connectSocket = () => {
    if(!socket || socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket("ws://localhost:8080");

        socket.onopen = () => {
            console.log("ws connected")
        }

        socket.onclose = () => {
            console.log("ws disconnected")
        }

        socket.onerror= (error) => {
            console.log("socket error", error)
        }
    }

    return socket;
}