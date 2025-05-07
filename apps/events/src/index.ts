import http from "http";  
import { WebSocketClass } from './socket';

const server = http.createServer();
new WebSocketClass(server);  

server.listen(8080, () => {
    console.log("ws server running on port 8080");
});
