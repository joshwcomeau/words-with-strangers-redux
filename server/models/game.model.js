import mongoose   from 'mongoose';

import GameSchema from './schemas/game.schema';


const Game = mongoose.model('Game', GameSchema)

export default Game;
