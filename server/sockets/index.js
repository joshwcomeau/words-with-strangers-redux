// Socket "routes".
import gameSockets      from './game.sockets.js';
import gamesListSockets from './games_list.sockets.js';




export default function(http) {
  const io    = require('socket.io')(http);

  gameSockets(io);
  gamesListSockets(io);

  io.on('connection', (socket) => {
    console.log("\nA user connected!\n\n")

    socket.on('disconnect', () => console.log("Client disconnected"));
  });
}
