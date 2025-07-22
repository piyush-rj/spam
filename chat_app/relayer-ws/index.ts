import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8085 });
console.log("relayer running on port 8085");

const servers: WebSocket[] = [];

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);

    servers.map(socket => {
        socket.send(data)
    })
  });

  ws.send('something');
});