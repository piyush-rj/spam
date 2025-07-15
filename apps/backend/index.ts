import http, { createServer } from "http";
import { WebSocketClass } from "./socket/socket";

const PORT = 8080;
const server = http.createServer();

const wsInstance = new WebSocketClass(server);

server.listen(PORT, () => {
    console.log("server running on port 8080")
})