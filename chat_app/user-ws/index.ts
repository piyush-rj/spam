import http from "http";
import WebSocketClass from "./Socket/socket";

const PORT = process.env.PORT;

if (!PORT) {
    console.log("port not found");
}

const server = http.createServer();
new WebSocketClass(server);

server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
