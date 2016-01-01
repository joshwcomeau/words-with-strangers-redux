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

  it('does not mutate the game itself', () => {
    expect(gameObject._id).to.exist;
    expect(gameObject._id).to.be.an('object');
    expect(gameObject.createdByUserId).to.exist;
    expect(gameObject.createdByUserId).to.be.an('object');
    expect(gameObject.__v).to.exist;
  })

  it('converts the game\'s base _id', () => {
    expect(gameJson._id).not.to.exist;
    expect(gameJson.id).to.exist;
    expect(gameJson.id).to.be.a('string');
  });

  it('converts the createdByUserId field', () => {
    expect(gameJson.createdByUserId).to.be.a('string');
  });
});
