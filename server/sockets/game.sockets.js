import * as _ from 'lodash';
import async  from 'async';

import Game from '../models/game.model';

import {
  REQUEST_GAMES_LIST,
  CREATE_GAME,
  SUBSCRIBE_TO_GAME,
  UNSUBSCRIBE_FROM_GAME,
  JOIN_GAME,
  GAME_STATUS_CHANGED,
  UPDATE_GAME_STATE,
  SUBMIT_WORD,
  ADD_GAMES_TO_LIST,
  PUSH_PATH,
} from '../../common/constants/actions.constants';

import { GAME_STATUSES } from '../../common/constants/config.constants';

export default function(mainIo) {
  let io = mainIo.of('/game');

  io.on('connection', (sock) => {
    sock.on(REQUEST_GAMES_LIST,     requestGamesList.bind(null, io, sock));
    sock.on(CREATE_GAME,            createGame.bind(null, io, sock));
    sock.on(SUBSCRIBE_TO_GAME,      subscribeToGame.bind(null, io, sock));
    sock.on(JOIN_GAME,              joinGame.bind(null, io, sock));
    sock.on(SUBMIT_WORD,            submitWord.bind(null, io, sock));
    sock.on(UNSUBSCRIBE_FROM_GAME,  unsubscribeFromGame.bind(null, io, sock));
  });
}

// PRIMARY SOCKET ACTIONS
function requestGamesList(io, socket, data) {
  Game.list( (err, games) => {
    socket.emit(ADD_GAMES_TO_LIST, games);
  });
}

function createGame(io, socket, data) {
  // TODO: Validations. Ensure user auth.

  const user = data.auth.user;

  // Create a game in the DB.
  let game = new Game({
    createdByUserId: user._id
  });

  game.join(user).save( (err) => {
    if ( err ) return console.error("Error creating game", err);

    socket.emit(PUSH_PATH, `/games/${game.id}`);

    // Dispatch an event to everyone else watching the games list,
    // so that they know there's a new game to join.
    socket.broadcast.emit(ADD_GAMES_TO_LIST, [game]);
  });

}
function subscribeToGame(io, socket, data) {
  // TODO: Add this user (or anonymous user) to the 'spectators' array.

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

    // Update the game state for players and spectators of this game
    broadcastGame(io, results.game);

    // If the game's status has changed, let's update that as well
    if ( results.game.status !== GAME_STATUSES.waiting ) {
      io.emit(GAME_STATUS_CHANGED, {
        game: results.game
      })
    }
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
  // Broadcast the new state to every user in the game.
  // NOTE: I can't simply use io.to('game-ID') because every connected
  // socket needs different data; they need their personalized view
  // of the game (and not the rack tiles of their opponent).

  // Find all the sockets currently in this game
  let impactedSockets = io.sockets.filter( socket => {
    return _.includes(socket.rooms, game.roomName)
  });

  // Emit an event to each one individually, letting the game model
  // generate the correct JSON for that user.
  impactedSockets.forEach( (iteratedSocket) => {
    iteratedSocket.emit(
      UPDATE_GAME_STATE,
      game.asSeenByUser(iteratedSocket.auth_user)
    );
  });
}
