import _        from 'lodash';
import mongoose from 'mongoose';
import moment   from 'moment';

import TileSchema               from './tile.schema';
import TurnSchema               from './turn.schema';
import BonusSquareSchema        from './bonus_square.schema';
import {
  createdAndUpdatedAt,
  toJSON
}  from '../plugins';

import generateTiles            from '../../lib/tile_generator.lib';
import {
  BOARD_SIZE,
  GAME_STATUSES,
  POINTS_TO_WIN,
  GAME_STATUSES_ENUM,
  FULL_RACK_SIZE,
  MINUTES_TO_SHOW_GAME,
  BONUS_SQUARE_PERCENTAGES
} from '../../../common/constants/config.constants';
import {
  isTentative,
  isEstablished,
  calculatePointsForTurn
} from '../../../common/lib/game_logic.lib';

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title:            { type: String },
  status:           {
    type:     String,
    enum:     GAME_STATUSES_ENUM,
    default:  GAME_STATUSES.waiting
  },
  createdByUserId:  {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  winnerUserId:     {
    // Originally this was going to be a derived field, but this is safer.
    // I might want to add the ability to 'surrender', in which case the
    // winner wouldn't necessarily be the user with the highest points.
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  players:          { type: [], default: [] },
  board:            { type: [TileSchema] },
  rack:             { type: [TileSchema] },
  turns:            { type: [TurnSchema] },
  bonusSquares:     { type: [BonusSquareSchema] }
});

GameSchema.plugin(createdAndUpdatedAt, { index: true });
GameSchema.plugin(toJSON);


//////////////////////////////////////////////////////////////
// INSTANCE METHODS /////////////////////////////////////////
////////////////////////////////////////////////////////////
GameSchema.methods.join = function(user) {
  // Don't let a player join the game multiple times.
  if ( this.players.find( player => player.id === user.id) )
    throw new Error('Stop that!');


  // Attach the player to the game
  this.players.push( user );

  // Give that player some starter tiles.
  this.replenishPlayerRack( user );

  // If the game has at least 2 players, start the game!
  if ( this.players.length > 1 ) this.status = GAME_STATUSES.in_progress;

  // Return self, for chainability;
  return this;
};

GameSchema.methods.submitWord = function(tiles, user) {
  // TODO: Validations.
  // For now, we're just going to trust the client.

  // 1. Add to board.
  // Find all tentative tiles (not part of a previous turn),
  // push those tiles into the game.board.
  let tentativeTiles = tiles.filter( isTentative );
  tentativeTiles.forEach( tile => {
    // When we sent the tiles to the client, we stripped Mongo's native
    // ObjectId on the `_id` key. Now that we're modifying Mongo's doc,
    // we need to re-add it, so that Mongo doesn't create a brand new
    // ID.

    // Create a working copy
    let tileCopy = _.clone(tile);
    // Add the converted ID
    tileCopy._id = mongoose.Types.ObjectId(tile.id);

    this.board.push(tileCopy)
  });

  // 2. Calculate points, and create a new turn
  const word   = _.map( tiles, 'letter' ).join('');

  const points = calculatePointsForTurn( tiles, this.board, this.bonusSquares );
  const turnId = this.turns.length;

  this.turns.push({
    word,
    points,
    id: turnId,
    playerId: user.id
  });

  // 3. Add the turn ID to the tentative tiles.
  this.board = this.board.map( tile => {
    if ( isTentative(tile) ) tile.turnId = turnId;
    return tile;
  })

  // 4. remove from rack
  // This is also pretty easy. We just need to delete these tiles
  // from the rack.
  tentativeTiles.forEach( tile => {
    this.rack.id(tile.id).remove()
  });

  // 5. Make sure the player gets some new tiles.
  this.replenishPlayerRack(user);

  // 6. Figure out if this is a game-winning turn
  const userPointsTotal = this.turns.reduce( (total, turn) => {
    // Ignore skipped/swapped turns
    if ( turn.pass ) return total;

    // Only consider the current user's points!
    if ( turn.playerId != user.id ) return total;

    return total + turn.points;
  }, 0);

  if ( userPointsTotal >= POINTS_TO_WIN ) {
    this.status = 'completed';
    this.winnerUserId = user.id;
  }

  return this;
};

GameSchema.methods.passTurn = function(user, reason = 'pass') {
  // We are only allowed to pass if it's our turn.
  // TODO: Some sort of exception handling? For now, given that it shouldn't
  // be possible to invoke this method when it isn't our turn, I'm just going
  // to ignore the request.
  if ( this.currentTurnUserId !== user.id) return this;

  this.turns.push({
    points:     0,
    pass:       true,
    passReason: reason,
    id:         this.turns.length,
    playerId:   user.id
  });

  return this;
};

GameSchema.methods.swapTiles = function(tiles, user) {
  // Swapping a tile consists of three distinct actions.
  // 1) We need to remove the specified tiles from the player's rack
  // 2) We need to give them some new tiles, as many as they sent.
  // 3) We need to create a new turn for this player. This is their turn.

  // Don't proceed if it isn't the user's turn.
  if ( this.currentTurnUserId !== user.id) return this;
  // ...Or if we haven't provided any tiles
  if ( _.isEmpty(tiles) )
    return console.error("You tried to swap tiles, but none were provided!");


  tiles.forEach( tile => {
    this.rack.id(tile.id).remove()
  });

  return this
    .replenishPlayerRack(user)
    .passTurn(user, 'swap');
};

GameSchema.methods.asSeenByUser = function(user = {}) {
  // TODO: This method is hideous. Find a better way.

  // Sends a copy of the game as viewed by a player.
  //   - They only have access to the tiles on the board or in THEIR rack.
  //     they don't receive the tiles in another player's rack
  //   - The player in the `players` array that corresponds with them is
  //     augmented with a `currentUser: true` flag.
  //   - the tiles that belong to the current user are augmented with a
  //     `belongsToCurrentUser: true` flag.
  //   - a special 'isMyTurn' Boolean property lets the client know if it's
  //     their turn or not.


  let game = this.toJSON();

  game.rack = game.rack.filter( tile => (
    tile.playerId === user.id
  ));

  game.players = game.players.map( player => {
    if ( player.id === user.id ) player.currentUser = true;
    return player;
  });

  game.rack = game.rack.map( tile => _.extend(tile, { belongsToCurrentUser: true }));
  game.board = game.board.map( tile => {
    tile.belongsToCurrentUser = tile.playerId === user.id;
    return tile;
  });
  game.isMyTurn = this.currentTurnUserId === user.id

  return game;
};


GameSchema.methods.replenishPlayerRack = function(player) {
  const numOfRackTiles = _.filter(this.rack, {
    playerId: player.id
  }).length;
  const numToRefill = FULL_RACK_SIZE - numOfRackTiles;

  this.rack = this.rack.concat( generateTiles(player.id, numToRefill) );

  return this;
};


GameSchema.methods.assignTitle = function() {
  // titles consist of a wordy adjective followed by a competitive noun.
  const adjectives = [
    'wordy', 'verbose', 'gabby', 'rhetorical', 'crackerjack', 'sagacious',
    'savvy', 'poetic', 'literary', 'idyllic', 'lyrical', 'belletristic',
    'latin', 'bookish', 'classical', 'chimerical'
  ].map(_.capitalize);

  const nouns = [
    'battle', 'clash', 'crusade', 'skirmish', 'engagement', 'blitzkreig',
    'struggle', 'tournament', 'jungle', 'business', 'adventure', 'diversion',
    'dispute', 'fracas', 'melee', 'showdown', 'brawl'
  ].map(_.capitalize);

  this.title = [_.sample(adjectives), _.sample(nouns)].join(' ');
};


GameSchema.methods.assignBonusSquares = function() {
  // First, figure out how many bonus squares this game will receive.
  // Should be 25-35% of the total squares.
  const [ minPercentage, maxPercentage ] = BONUS_SQUARE_PERCENTAGES;
  const percentage = _.random(minPercentage, maxPercentage);
  const numOfTiles = Math.round( Math.pow(BOARD_SIZE, 2) * (percentage / 100) );

  let square;
  _.times(numOfTiles, () => {
    square = BonusSquareSchema.statics.generateBonusSquare(this);
    this.bonusSquares.push(square);
  });
};



//////////////////////////////////////////////////////////////
// CLASS METHODS ////////////////////////////////////////////
////////////////////////////////////////////////////////////
GameSchema.statics.list = function(callback) {
  // For now, we want all non-abandoned games created in the last 5 days.
  return this.find({
    status:     { $in: [GAME_STATUSES.waiting, GAME_STATUSES.in_progress] },
    createdAt:  {
      $gte: moment().subtract(MINUTES_TO_SHOW_GAME, 'minutes').toDate()
    }
  }, callback);

}


//////////////////////////////////////////////////////////////
// VIRTUAL PROPERTIES ///////////////////////////////////////
////////////////////////////////////////////////////////////
GameSchema.virtual('roomName').get( function() {
  return `game_${this.id}`;
});

GameSchema.virtual('currentTurnUserId').get( function() {
  // Assuming that the creator of the game is the first player in the
  // 'players' array. I believe this is a safe assumption.

  // Also assuming that you can't join or leave a game that is in progress.
  // May need to revisit this at some point.

  // if nobody's moved yet, it's the creator's turn.
  if ( _.isEmpty(this.turns) ) return this.createdByUserId.toString();

  // Otherwise, just do the math
  let player = this.players[ this.turns.length % this.players.length ];
  return player.id;
});



//////////////////////////////////////////////////////////////
// HOOKS ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
GameSchema.pre('save', function(next) {
  if ( !this.isNew ) return next();

  if ( !this.title ) this.assignTitle();

  if ( _.isEmpty(this.bonusSquares) ) this.assignBonusSquares();

  return next();
});


export default GameSchema;
