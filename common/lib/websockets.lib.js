import io                       from 'socket.io-client';
import {
  ADD_GAMES_TO_LIST
} from '../constants/actions.constants';
import * as GamesListActions from '../actions/games_list.actions';


export function initialize(store) {
  const socket = io.connect('', {
    query: 'person'
  });

  // Sockets are used for full-duplex communication between client and server.
  // For example, when we submit a word, it emits an event to the server.
  // The server processes that information (persists the Turn in the database),
  // and then emits an event to all other players in the game.
  // The other clients receive the event, and it causes an Action to be
  // dispatched, which updates all other clients to the turn played by the user.

  socket.on(ADD_GAMES_TO_LIST, function(games) {
    console.log("Got games!", games);

    store.dispatch( GamesListActions.addGamesToList(games) );
  });

}
