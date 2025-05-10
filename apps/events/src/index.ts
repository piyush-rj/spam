import http from "http";
import express from "express";
import router from "./routes";
import { WebSocketClass } from "./socket";
import cors from "cors"

const app = express();
app.use(cors())
app.use(express.json());
app.use("/api", router);

const server = http.createServer(app);
new WebSocketClass(server);

server.listen(8080, () => {
    console.log("http + ws running on port 8080");
});
