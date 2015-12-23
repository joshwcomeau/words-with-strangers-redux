
import Game from '../models/game.model';

import {
  ADD_GAMES_TO_LIST,
  CREATE_GAME
} from '../../common/constants/actions.constants';
import * as _ from 'lodash';

export default function(io) {
  let gamesListIo = io.of('/games');

  gamesListIo.on('connection', function(socket) {
    console.log("Connection to gamesList!")
    // Send the user the initial list of games
    Game.find({}, (err, games) => {
      socket.emit(ADD_GAMES_TO_LIST, games);
    })

    // const games = [
    //   {
    //     _id: 1,
    //     createdAt: '2015-12-21T16:00:00-05:00',
    //     title: 'Wording Around',
    //     status: 'playing',
    //     players: [{
    //       _id: '123',
    //       username: 'Susan Smithy',
    //       profilePhoto: 'https://s3.amazonaws.com/wordswithstrangers/animal-03.png'
    //     }, {
    //       _id: '456',
    //       username: 'Ivan John Plato',
    //       profilePhoto: 'https://s3.amazonaws.com/wordswithstrangers/animal-01.png'
    //     }]
    //   }, {
    //     _id: 2,
    //     createdAt: '2015-12-21T15:54:12-05:00',
    //     title: 'Come spell!',
    //     status: 'waiting',
    //     players: [{
    //       _id: '789',
    //       username: 'Spellington',
    //       profilePhoto: 'https://s3.amazonaws.com/wordswithstrangers/animal-02.png'
    //     }]
    //   }
    // ];



    socket.on(CREATE_GAME, function(data) {
      // TODO: Validations. Ensure a user exists.

      const user = data.auth.user
      // Create a game in the DB.
      let game = new Game({
        createdBy: user._id
      });

      game.joinGame(user);
      game.save( (err) => {
        console.log("GAME SAVED", err, game)
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
