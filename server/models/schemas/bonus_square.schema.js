import _        from 'lodash';
import mongoose from 'mongoose';

import { BOARD_SIZE }       from '../../../common/constants/config.constants';
import { findBonusSquare }  from '../../../common/lib/game_logic.lib';

const Schema = mongoose.Schema;



const BonusSquareSchema = new Schema({
  x:        { type: Number, min: 0},
  y:        { type: Number, min: 0},
  label:    { type: String },
  effect:   { type:
    {
      wordMultiplier: { type: Number, default: 1 },
      tileMultiplier: { type: Number, default: 1 }
    }
  }
});

// Return an array of the possible 'types'
// This allows us to keep a very flexible schema in the DB, but still have
// a finite number of possible effects in the interface.
// It also allows us to set different weightings, so that not all types are
// equally likely of being selected.
BonusSquareSchema.statics.validEffects = [
  {
    // Double Word
    label:     'dw',
    likelihood: 10,
    effect:     { wordMultiplier: 2 }
  }, {
    // Triple Word
    label:     'tw',
    likelihood: 5,
    effect:     { wordMultiplier: 3 }
  }, {
    // Double Letter
    label:     'dl',
    likelihood: 20,
    effect:     { tileMultiplier: 2 }
  }, {
    // Triple Letter
    label:     'tl',
    likelihood: 10,
    effect:     { tileMultiplier: 3 }
  }
];

// Create a distribution array for each valid type.
// Will be used in the `.selectRandomEffect` class method.
BonusSquareSchema.statics.validEffectsDistributionArray = _.reduce(
  BonusSquareSchema.statics.validEffects,
  (memo, type) => (
    memo.concat( _.times(type.likelihood, () => type.label) )
  ),
  []
);


BonusSquareSchema.statics.selectRandomEffect = function() {
  const effectLabel = _.sample(this.validEffectsDistributionArray);
  const effect      = _.find(this.validEffects, { label: effectLabel });

  return _.omit(effect, 'likelihood');
}

BonusSquareSchema.statics.findSuitableHome = function(game) {
  // Try a random square on the board.
  let coords = {
    x: _.random(0, BOARD_SIZE-1),
    y: _.random(0, BOARD_SIZE-1)
  };

  // We want to avoid storing multiple bonus squares on the same tile.
  // In the event that one already exists at this location, try again.
  if ( findBonusSquare(coords, game.bonusSquares) )
    return this.findSuitableHome(game);

  return coords;

}

BonusSquareSchema.statics.generateBonusSquare = function(game) {
  const coordinates = this.findSuitableHome(game);

  return _.extend( coordinates, this.selectRandomEffect() );
}


export default BonusSquareSchema;
