import { expect } from 'chai';
import _          from 'lodash';
import moment     from 'moment';
import mongoose   from 'mongoose';
import bcrypt     from 'bcrypt';

import Game from '../../server/models/game.model';

import {
  GAME_STATUSES,
  FULL_RACK_SIZE
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
      expect(game.status).to.equal('waiting');
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
        expect(game.status).to.equal('in_progress');
      })

    });

  });
});
