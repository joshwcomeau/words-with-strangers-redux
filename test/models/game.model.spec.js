import { expect } from 'chai';
import _          from 'lodash';
import moment     from 'moment';
import mongoose   from 'mongoose';
import bcrypt     from 'bcrypt';

import Game from '../../server/models/game.model';

import {
  GAME_STATUSES,
  FULL_RACK_SIZE,
  MINUTES_TO_SHOW_GAME
} from '../../common/constants/config.constants';


let game;
let player = {
  _id: mongoose.Types.ObjectId(),
  username: 'Main man'
};

let opponent = {
  _id: mongoose.Types.ObjectId(),
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
        createdByUserId: player._id
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

    it('includes the right games', () => {
      Game.list( (err, games) => {
        expect( err ).not.to.exist;
        expect( games.length ).to.equal(3);
        expect( _.pluck(games, 'title') ).to.deep.equal(['YES','YES','YES']);
      });
    });
  });

  describe('#join', () => {
    before( done => {
      game = new Game({
        createdByUserId: player._id
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
          expect(tile.playerId).to.equal(player._id);
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
        let tiles = game.rack.filter( tile => tile.playerId === opponent._id);
        expect(tiles).to.have.length(FULL_RACK_SIZE);
      });

      it('sets the game status as `in_progress`', () => {
        expect(game.status).to.equal(GAME_STATUSES.in_progress);
      })

    });

  });
});
