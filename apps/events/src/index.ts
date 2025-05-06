import http from "http";  
import { WebSocketClass } from './socket';

const server = http.createServer();
new WebSocketClass(server);  

server.listen(8080, () => {
    console.log("WebSocket server listening on ws://localhost:8080");
});
