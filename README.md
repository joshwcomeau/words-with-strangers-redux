# Words with Strangers
### An experiment with universal React, Redux and Socket.io.
##### Also featuring immutable.js, ES6, react-dnd, redux-simple-router and more.

[![build status](https://travis-ci.org/joshwcomeau/words-with-strangers-redux.svg)](https://travis-ci.org/joshwcomeau/words-with-strangers-redux)

## [Play now!](http://wordswithstrangers.ca/)


## Introduction
After building a Scrabble clone with React and Meteor, I decided to take the training wheels off and give it a try with a home-grown stack, with Redux as my state manager (primarily on the client, but it sets up initial state on the server), React as my presentation layer, and Socket.io to handle most communication across the app.

There have been a lot of hard problems along the way, and certain areas are in dire need of some cleanup, but I've learned a lot and I'm hoping some of the solutions found can help others working with a similar stack.

----------------


## Communication
At the heart of a real-time web app is server-client communication.

#### Namespaces and Rooms

Socket.io offers namespaces, which allow separate parts of your app to behave independently while still sharing a single TCP connection. In my app, I have 3 such namespaces:

  * '/'             Currently unused. The root connection
  * '/game'         Used for actions within a game (submitting words)
  * '/gamesList'    Used for the 'list of games' view.

Within each namespace, you can also have 'rooms'. Clients will only be connected to 1 game at a time but the server will have to deal with multiple simultaneous games. To differentiate between them, each socket in the '/game' namespace will join its own room, based off of the game's id.


#### Client and server actions

Most of the actions are typical synchronous Redux actions. For example, dragging and dropping a Tile from the TileRack to the Board is a straightforward PLACE_TILE action: It updates the local state without sending anything to the server.

##### 1. Dispatching the data to the server
Submitting a word, though, requires a database update. I wrote a quick socket middleware that tackles this job.

Each socket gets its own instance of the middleware, with its socket partially applied. In my example I have 3 socket middlewares that each listen for remote actions sent over its namespace.

The action creator dispatches something like:

```
{
  type: 'SUBMIT_WORD',
  meta: { remote: '/game' },
  tiles: [ {...tile data}, ... ]
}
```

My first socket middleware, '/', intercepts the request but quickly forwards it on because the remote namespace doesn't match its own socket's `nsp` property. The second middleware, '/game', detects that it is needed, so it:

  * Gets the current user's authentication data from the store, so that the server knows which user is making the request.
  * Emits an action to the server, of the type specified ('SUBMIT_WORD'), with the tiles array as part of its payload, merged in with the user's auth data.

##### 2. Updating the data, and dispatching the results to the client
On initialization, the server sets up some listeners. I created a 'sockets' folder on the server with one file per namespace.

In each namespace, an `io` instance listens for incoming requests, and when one is heard, it sets up some event handlers:

```
let gameIo = io.of('/game');

gameIo.on('connection', (socket) => {
  socket.on(SUBMIT_WORD, (data) => {
    // game logic. I update all the necessary server state here.

    game.save( err => {
      // error handling stuff here

      socket.emit(UPDATE_GAME_STATE, game);
    });
  });
});

```

##### 3. Client responds to server event
In that last line, after all the server work is done, it emits an event of the type UPDATE_GAME_STATE

    NOTE: By convention, I'm naming all my socket events after the constants used by Redux's action creators. I'm also naming all my publicly-exposed action creators as a camelCased version of the CONSTANT_NAME (eg. I have `submitWord` and `updateGameState` actions);

When the client initializes, I set up some listeners on the 3 sockets created, that each dispatch any data they receive onto the reducer to deal with.

```
sockets = [
  io(),
  io('/game'),
  io('/gamesList')
];

sockets.forEach( socket => {
  // some boilerplate to make a catch-all event handler

  socket.on('*', (event, data) => {
    const actionName    = _.camelCase(event);

    // I need to get a reference to the action creator.
    // They're split across several files, but I import an index that merges
    // them all together. By convention, action creator names are unique.
    const actionCreator = actionCreatorIndex[actionName]

    store.dispatch( actionCreator(data) );
  });
});
```

##### 4. handling the UPDATE_GAME_STATE action

Finally, all that's left to do is handle that action, to update the client's view of the world.

There may be some client-only data that we want to preserve unless the server has explicitly changed it. Therefore, all we need to do in the reducer is:

```
switch (action.type) {
  case UPDATE_GAME_STATE:
    return state.mergeDeep( fromJS(action.game) )
```

    NOTE: Real-world complications
    There may be client-only data we DO want to preserve, such as the order of the tiles in a player's rack. I'm choosing not to worry about these details for now, but if/when I decide that's important, I'd have to write custom merge functions for dealing with such conflicts. Thankfully, Immutable.js provides a `mergeDeepWith` method that should be able to help.



----------------

## Testing

This app has so-so coverage of reducers, custom game logic, and server models. Uses mocha as a test runner and Chai for assertions (using Expect).

Tests can be run with NPM: `npm run test`.

Specific files can be tested by passing in filenames: `npm test **/game.reducer*`. Or, you can use `describe.only` and `describe.except`.
