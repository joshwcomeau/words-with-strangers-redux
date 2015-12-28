import _ from 'lodash';
import mongoose from 'mongoose';

import { createdAndUpdatedAt }  from '../plugins';
import TileSchema               from './tile.schema';
import TurnSchema               from './turn.schema';
import UserSchema               from './user.schema';

import { fetchTiles }           from '../../../common/lib/tiles.lib';
import { FULL_RACK_SIZE }       from '../../../common/constants/config.constants';
import { isTentative }          from '../../../common/lib/game_logic.lib';

const Schema = mongoose.Schema;


const GameSchema = new Schema({
  title:            { type: String },
  createdByUserId:  { type: Schema.Types.ObjectId },
  players:          { type: [UserSchema] },
  board:            { type: [TileSchema] },
  rack:             { type: [TileSchema] },
  turns:            { type: [TurnSchema] }
});

GameSchema.plugin(createdAndUpdatedAt, { index: true });


//////////////////////////////////////////////////////////////
// INSTANCE METHODS /////////////////////////////////////////
////////////////////////////////////////////////////////////
GameSchema.methods.join = function(player) {
  // Attach the player to the game
  this.players.push(player);

  // Give that player some starter tiles.
  this.replenishPlayerRack(player);

  // Return self, for chainability;
  return this;
}

GameSchema.methods.submitWord = function(tiles, user) {
  // TODO: Validations.
  // For now, we're just going to trust the client.

  // 1. Create a new Turn
  const word    = _.pluck( tiles, 'letter' ).join('');
  const points  = _.sum( tiles, tile => tile.points );
  const turnId  = this.turns.length;

  this.turns.push({
    word,
    points,
    _id: turnId,
    playerId: user._id
  });

  // 2. add to board.
  // Find all tentative tiles (not part of a previous turn),
  // add the new turnId to each new tile
  // push those tiles into the game.board.
  let tentativeTiles = tiles.filter( isTentative );
  tentativeTiles = tentativeTiles.map( tile => {
    tile.turnId = turnId;
    return tile;
  });

  tentativeTiles.forEach( tile => this.board.push(tile) );

  // 3. remove from rack
  // This is also pretty easy. We just need to delete these tiles
  // from the rack.
  tentativeTiles.forEach( tile => {
    this.rack.id(tile._id).remove()
  });

  // 4. Make sure the player gets some new tiles.
  this.replenishPlayerRack(user);

  return this;
}

GameSchema.methods.asSeenByUser = function(user = {}) {
  // TODO: This method is hideous. Find a better way.

  // Sends a copy of the game as viewed by a player.
  //   - They only have access to the tiles on the board or in THEIR rack.
  //     they don't receive the tiles in another player's rack
  //   - The player in the `players` array that corresponds with them is
  //     augmented with a `currentUser: true` flag.
  //   - the tiles that belong to the current user are augmented with a
  //     `belongsToCurrentUser: true` flag.


  let game = this.toJSON();

  game.rack = game.rack.filter( tile => (
    tile.playerId.toString() === user._id
  ));

  game.players = game.players.map( player => {
    if ( player._id.toString() === user._id ) player.currentUser = true;
    return player;
  });

  game.rack = game.rack.map( tile => _.extend(tile, { belongsToCurrentUser: true }));
  game.board = game.board.map( tile => {
    if ( tile.playerId.toString() === user._id ) {
      tile.belongsToCurrentUser = true;
    }
    return tile;
  })

  return game;
}

GameSchema.methods.replenishPlayerRack = function(player) {
  const playerId = mongoose.Types.ObjectId(player._id);
  const numOfRackTiles = _.filter(this.rack, { playerId }).length;
  const numToRefill = FULL_RACK_SIZE - numOfRackTiles;

  this.rack = this.rack.concat( fetchTiles(player, numToRefill) );
}

GameSchema.methods.generateTitle = function() {
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
  console.log("Assigned title", this.title);
}

//////////////////////////////////////////////////////////////
// CLASS METHODS ////////////////////////////////////////////
////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////
// VIRTUAL PROPERTIES ///////////////////////////////////////
////////////////////////////////////////////////////////////
GameSchema.virtual('roomName').get( function() {
  return `game_${this._id}`;
});



//////////////////////////////////////////////////////////////
// HOOKS ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
GameSchema.pre('save', function(next) {
  if ( !this.isNew ) return next();

  // Give the game a random title!
  this.generateTitle();

  return next();
});

export default GameSchema;
