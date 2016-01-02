import { expect } from 'chai';
import _          from 'lodash';
import mongoose   from 'mongoose';

import Game       from '../../../server/models/game.model';
import User       from '../../../server/models/user.model';


describe('#toJSON plugin', () => {
  let gameObject, gameJson;

  before( (done) => {

    // Create and save a user,
    // then create and save a game,
    // then call the .toJSON method on that saved game.
    const createAndSaveUser = () => {
      return new Promise( (resolve, reject) => {
        User.create({
          username: 'j',
          password: '123'
        }, (err, user) => {
          return err ? reject(err) : resolve(user);
        });
      });
    };

    const createAndSaveGame = user => {
      return new Promise( (resolve, reject) => {
        let game = new Game({
          title: 'A Test Game',
          createdByUserId: user._id
        });

        game.join(user).save( err => {
          return err ? reject(err) : resolve(game);
        });
      });
    }

    createAndSaveUser()
      .then( createAndSaveGame )
      .then( game => {
        gameObject  = game;
        gameJson    = game.toJSON();
        return done();
      });
  });

  it("converts the game's base _id", () => {
    expect(gameJson._id).not.to.exist;
    expect(gameJson.id).to.exist;
    expect(gameJson.id).to.be.a('string');
  });

  it("does not mutate the original game's _id", () => {
    expect(gameObject._id).to.be.an.instanceof(mongoose.Types.ObjectId);
  })

  it('converts the createdByUserId field', () => {
    expect(gameJson.createdByUserId).to.be.a('string');
  });

  it('does not mutate the original createdByUserId field', () => {
    expect(gameObject.createdByUserId).to.be.an.instanceof(mongoose.Types.ObjectId);
  })

  it('converts the embedded player document', () => {
    const player = gameJson.players[0];

    expect(player._id).not.to.exist;
    expect(player.id).to.be.a('string');
  });

  it('does not mutate the original embedded player document', () => {
    const player = gameObject.players[0];

    expect(player._id).to.exist;
    expect(player._id).to.be.an.instanceof(mongoose.Types.ObjectId);
  });

  it('converts the embedded tile documents', () => {
    const tiles = gameJson.rack;

    tiles.forEach( tile => {
      expect(tile._id).not.to.exist;
      expect(tile.id).to.be.a('string');
    });
  });

  it('does not mutate the original embedded tile documents', () => {
    const tiles = gameObject.rack;

    tiles.forEach( tile => {
      expect(tile._id).to.exist;
      expect(tile._id).to.be.an.instanceof(mongoose.Types.ObjectId);
    });
  });
});
