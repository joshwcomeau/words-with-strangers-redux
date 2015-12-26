import * as _ from 'lodash';
import async  from 'async';

import Game from '../models/game.model';

import {
  CREATE_GAME,
  SUBSCRIBE_TO_GAME,
  UNSUBSCRIBE_FROM_GAME,
  JOIN_GAME,
  UPDATE_GAME_STATE,
  SUBMIT_WORD,
  ADD_GAMES_TO_LIST,
  PUSH_PATH,
} from '../../common/constants/actions.constants';

export default function(mainIo) {
  let io = mainIo.of('/game');

  io.on('connection', (socket) => {
    socket.on(CREATE_GAME,            createGame.bind(null, io, socket) );
    socket.on(SUBSCRIBE_TO_GAME,      subscribeToGame.bind(null, io, socket) );
    socket.on(JOIN_GAME,              joinGame.bind(null, io, socket) );
    socket.on(SUBMIT_WORD,            submitWord.bind(null, io, socket) );
    socket.on(UNSUBSCRIBE_FROM_GAME,  unsubscribeFromGame.bind(null, io, socket));
  });
}

// PRIMARY SOCKET ACTIONS
function createGame(io, socket, data) {
  // TODO: Validations. Ensure user auth.

  const user = data.auth.user;

  // Create a game in the DB.
  let game = new Game({
    createdBy: user._id
  });

  game.join(user).save( (err) => {
    if ( err ) return console.error("Error creating game", err);

    socket.emit(PUSH_PATH, `/games/${game._id}`);

    // Dispatch an event to everyone else watching the games list,
    // so that they know there's a new game to join.
    socket.broadcast.emit(ADD_GAMES_TO_LIST, [game]);
  });

}
function subscribeToGame(io, socket, data) {
  // Attach our user data to this socket, so that it can be used when
  // broadcasting to the room
  if ( data.auth ) socket.auth_user = data.auth.user;

  async.auto({
    game: findGame.bind(null, data.gameId),
    joinRoom: ['game', (step, r) => {
      socket.join(r.game.roomName, step);
    }]
  }, (err, results) => {
    if ( err ) return console.error("Error subscribing to game", err);

    broadcastGame(io, results.game);
  });
}

function joinGame(io, socket, data) {
  async.auto({
    game: findGame.bind(null, data.gameId),
    join: ['game', (step, r) => {
      r.game.join(data.auth.user).save(step);
    }]
  }, (err, results) => {
    if ( err ) return console.error("Error joining game", err);

    broadcastGame(io, results.game);
  });
}

function submitWord(io, socket, data) {

  async.auto({
    game: findGame.bind(null, data.gameId),
    submit: ['game', (step, r) => {
      r.game.submitWord(data.tiles, data.auth.user).save(step)
    }]
  }, (err, results) => {
    if ( err ) return console.error("Error submitting word", err);

    broadcastGame(io, results.game);
  });
}

function unsubscribeFromGame(io, socket, data) {
  async.auto({
    game: findGame.bind(null, data.gameId),
    leaveRoom: ['game', (step, r) => {
      socket.leave(r.game.roomName, step);
    }]
  }, (err, results) => {
    if ( err ) return console.error("Error unsubscribing from game:", err);
  });
}



// HELPERS
function findGame(gameId, callback) {
  Game.findById(gameId, (err, game) => {
    if ( err )    return callback(err);
    if ( !game )  return callback(`No game found with ID ${gameId}`);
    return callback(null, game);
  });
}

function broadcastGame(io, game) {
  // Find all the sockets currently in this game
  let impactedSockets = io.sockets.filter( socket => {
    return _.includes(socket.rooms, game.roomName)
  });

  impactedSockets.forEach( (iteratedSocket) => {
    iteratedSocket.emit(
      UPDATE_GAME_STATE,
      game.asSeenByUser(iteratedSocket.auth_user)
    );
  });
}
