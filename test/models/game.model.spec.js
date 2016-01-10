import { expect } from 'chai';
import _          from 'lodash';
import moment     from 'moment';
import mongoose   from 'mongoose';
import bcrypt     from 'bcrypt';

import Game from '../../server/models/game.model';
import BonusSquareSchema from '../../server/models/schemas/bonus_square.schema'

import {
  BOARD_SIZE,
  GAME_STATUSES,
  FULL_RACK_SIZE,
  MINUTES_TO_SHOW_GAME,
  BONUS_SQUARE_PERCENTAGES
} from '../../common/constants/config.constants';


let game;

// Users have 'id' strings because they are sent from the client.
// All models are converted to plain JSON, with a switch from
// Mongo's ObjectId at `_id` to a string representation at `id`.
// See to_json.plugin for more info.
let player = {
  id: mongoose.Types.ObjectId().toString(),
  username: 'Main man'
};

let opponent = {
  id: mongoose.Types.ObjectId().toString(),
  username: 'Fierce Competitor'
};


describe('Game model', () => {
  describe('validation', () => {
    it('requires a `createdByUserId`', (done) => {
      game = new Game();
      game.save( (err) => {
        expect(err).to.exist;
        expect(err.name).to.equal('ValidationError');
        expect(err.errors).to.include.key('createdByUserId');
        expect(err.errors.createdByUserId.kind).to.equal('required');
        return done();
      });
    });
  });

  describe('initialization', () => {
    before( (done) => {
      game = new Game({
        createdByUserId: player.id
      });
      game.save( done );
    });

    it('attaches a randomized title', () => {
      expect(game.title).to.match(/\w+/gi);
    });

    it('creates a default, empty players array', () => {
      expect(game.players).to.be.an('array');
      expect(game.players).to.be.empty;
    });

    it('defaults to `waiting` status.', () => {
      expect(game.status).to.equal(GAME_STATUSES.waiting);
    });
  });

  describe('.list', () => {
    before ( done => {
      const limit = MINUTES_TO_SHOW_GAME;
      Game.remove({}, () => {
        Game.create([
          {
            // Ideal game
            status:     GAME_STATUSES.waiting,
            title:      'YES',
            createdAt:  moment().subtract(1, 'minutes').toDate(),
            createdByUserId: mongoose.Types.ObjectId()
          }, {
            // Older, but still relevant
            status:     GAME_STATUSES.waiting,
            title:      'YES',
            createdAt:  moment().subtract(limit/2, 'minutes').toDate(),
            createdByUserId: mongoose.Types.ObjectId()
          }, {
            // Different status, but acceptable
            status:     GAME_STATUSES.in_progress,
            title:      'YES',
            createdAt:  moment().subtract(limit/4, 'minutes').toDate(),
            createdByUserId: mongoose.Types.ObjectId()
          }, {
            // Slightly over the limit
            status:     GAME_STATUSES.waiting,
            title:      'NO',
            createdAt:  moment().subtract(limit+1, 'minutes').toDate(),
            createdByUserId: mongoose.Types.ObjectId()
          }, {
            // Abandoned
            status:     GAME_STATUSES.abandoned,
            title:      'NO',
            createdAt:  moment().subtract(1, 'minutes').toDate(),
            createdByUserId: mongoose.Types.ObjectId()
          }
        ], done);
      })
    });

    it('includes the right games', (done) => {
      Game.list( (err, games) => {
        expect( err ).not.to.exist;
        expect( games.length ).to.equal(3);
        expect( _.pluck(games, 'title') ).to.deep.equal(['YES','YES','YES']);
        done()
      });
    });
  });

  describe('#join', () => {
    before( done => {
      game = new Game({
        createdByUserId: player.id
      });

      game.join(player).save( done );
    });

    context('creator joining his own game', () => {
      it('adds the creator to the players array', () => {
        expect(game.players).to.have.length(1);
        expect(game.players).to.include(player);
      });

      it('generates tiles for the creator', () => {
        expect(game.rack).to.have.length(FULL_RACK_SIZE);
      });

      it('sets those tiles as belonging to the player', () => {
        _.every(game.rack, tile => {
          expect(tile.playerId).to.equal(player.id);
        })
      })
    });

    context('opponent joining the game', () => {
      before( done => game.join(opponent).save(done) );

      it('adds the opponent to the players array', () => {
        expect(game.players).to.have.length(2);
        expect(game.players).to.include(player);
      });

      it('generates tiles for the opponent', () => {
        expect(game.rack).to.have.length(FULL_RACK_SIZE * 2);
      });

      it('sets those tiles as belonging to the opponent', () => {
        let tiles = game.rack.filter( tile => tile.playerId === opponent.id);
        expect(tiles).to.have.length(FULL_RACK_SIZE);
      });

      it('sets the game status as `in_progress`', () => {
        expect(game.status).to.equal(GAME_STATUSES.in_progress);
      });
    });
  });

  describe('#passTurn', () => {
    before( done => {
      game = new Game({
        createdByUserId: player.id
      });

      game.join(player).join(opponent);

      let random_player_tile = _.sample(
        _.filter(game.rack, tile => tile.playerId === player.id)
      );
      game.submitWord([{
        x:        1,
        y:        1,
        playerId: player.id,
        letter:   random_player_tile.letter,
        points:   5,
        id:       random_player_tile.id
      }], player).save( done );
    });

    it('does not let the creator pass; it is not his turn', () => {
      expect(game.turns).to.have.length.of(1);
      game.passTurn(player);
      // It does nothing. No error, but no adding a turn either.
      expect(game.turns).to.have.length.of(1);
    });

    it('does let the opponent pass', () => {
      game.passTurn(opponent);

      expect(game.turns).to.have.length.of(2);

      let passedTurn = _.last(game.turns);
      expect(passedTurn.points).to.equal(0);
      expect(passedTurn.pass).to.equal(true);
      expect(passedTurn.playerId.toString()).to.equal(opponent.id);
    });

  });

  describe('#assignBonusSquares', () => {
    let game;

    before( (done) => {
      Game.create({
        createdByUserId: player.id
      }, (err, savedGame) => {
        if (err) throw err;
        game = savedGame;
        return done();
      });
    });

    it('should have created an appropriate number', () => {
      const [minPerc, maxPerc] = BONUS_SQUARE_PERCENTAGES;
      const min = Math.floor(Math.pow(BOARD_SIZE, 2) * minPerc / 100);
      const max = Math.ceil(Math.pow(BOARD_SIZE, 2) * maxPerc / 100);

      expect(game.bonusSquares).to.have.length.of.at.least(min);
      expect(game.bonusSquares).to.have.length.of.at.most(max);
    });

    it('should assure that all coordinates are unique', () => {
      const coords = game.bonusSquares.reduce( (memo, bonus) => {
        // Create a string representation of each co-ordinate pair
        // As long as the coords are different, the string will be unique!
        memo.push(`${bonus.x}-${bonus.y}`);
        return memo;
      }, []);

      // By comparing the original array to one with duplicates removed,
      // we'll know if each bonus square is alone in its space.
      expect(coords).to.deep.equal(_.uniq(coords));
    });

    it('should assure that all coordinates are valid', () => {
      const coords = [].concat(
        _.pluck(game.bonusSquares, 'x'),
        _.pluck(game.bonusSquares, 'y')
      );

      coords.forEach( coord => {
        expect(coord).to.be.at.least(0);
        expect(coord).to.be.at.most(BOARD_SIZE-1)
      });
    });

    it('should include a valid effect', () => {
      // Because each tile is generated the same way, it seems like a safe
      // assumption to just test the first one, rather than all 50+.
      const bonusSquare   = _.first(game.bonusSquares);

      const validEffects = _.pluck(BonusSquareSchema.statics.validEffects, 'effect');
      const applicableEffect = _.find(validEffects, (validEffect) => {
        const validEffectKey  = _.keys(validEffect)[0];
        const validEffectVal  = _.values(validEffect)[0];
        const effectKey       = _.keys(bonusSquare.effect)[0];
        const effectVal       = _.values(bonusSquare.effect)[0];

        return (validEffectKey === effectKey && validEffectVal === effectVal);
      });
      expect(applicableEffect).to.be.ok;

      const labels = _.pluck(BonusSquareSchema.statics.validEffects, 'label');
      expect(labels).to.include(bonusSquare.label);
    });
  });
});
