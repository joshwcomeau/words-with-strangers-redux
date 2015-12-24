
import Game from '../models/game.model';

import {
  REQUEST_GAMES_LIST,
  ADD_GAMES_TO_LIST,
  CREATE_GAME
} from '../../common/constants/actions.constants';
import * as _ from 'lodash';

export default function(io) {
  let gamesListIo = io.of('/games');

  gamesListIo.on('connection', function(socket) {
    console.log("Connection to gamesList!")

    socket.on(REQUEST_GAMES_LIST, function(data) {
      // Send the user the initial list of games
      Game.find({}, (err, games) => {
        socket.emit(ADD_GAMES_TO_LIST, games);
      });
    });

    socket.on(CREATE_GAME, function(data) {
      // TODO: Validations. Ensure user auth.

      const user = data.auth.user
      // Create a game in the DB.
      let game = new Game({
        createdBy: user._id
      });

      game.joinGame(user);
      game.save( (err) => {
        // TODO: Error handling

        socket.emit(ADD_GAMES_TO_LIST, [game])
      });

      console.log("Request from", this)
      console.log("Sent:", data)
      console.log("Data keys:", _.keys(data))
      console.log("Data values:", _.values(data))
    })
  });
}
