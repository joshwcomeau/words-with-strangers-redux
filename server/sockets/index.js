// Socket "routes".
import gameSockets      from './game.sockets.js';


export default function(http) {
  const io    = require('socket.io')(http);

  gameSockets(io);

  io.on('connection', (socket) => {
    console.log("\nA user connected!\n\n")

    socket.on('disconnect', () => console.log("Client disconnected"));
  });
}
