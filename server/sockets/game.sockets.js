import * as _ from 'lodash';

import Game from '../models/game.model';

import {
  SUBSCRIBE_TO_GAME,
  UPDATE_GAME_STATE
} from '../../common/constants/actions.constants';


export default function(io) {
  let gameIo = io.of('/game');

  gameIo.on('connection', function(socket) {
    socket.on(SUBSCRIBE_TO_GAME, function(data) {
      socket.join(`game_${data.gameId}`);

      // Send down the initial game data.
      Game.findById(data.gameId, (err, game) => {
        socket.emit(UPDATE_GAME_STATE, game.asSeenByPlayer(data.auth.user))
      })
    });
  });
}
