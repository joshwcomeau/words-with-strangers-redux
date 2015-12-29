import { expect } from 'chai';
import * as _     from 'lodash';
import moment     from 'moment';
import faker      from 'faker';
import bcrypt     from 'bcrypt';

import User from '../../server/models/user.model';


describe('User model', () => {
  context('validations', () => {
    it('fails without a username', (done) => {
      const user = new User({
        password: 'abcd1234'
      });

      user.save( (err) => {
        expect(err).to.exist;
        expect(err.name).to.equal('ValidationError');
        expect(err.errors).to.include.key('username');
        expect(err.errors.username.kind).to.equal('required');

        done()
      });
    });

    it('does not allow multiple users to share a username', (done) => {
      const userProperties = { username: 'duplicate', password: '12345678' };

      User.create(userProperties , () => {
        User.create(userProperties, (err) => {
          expect(err).to.exist;
          expect(err.name).to.equal('MongoError');
          expect(err.code).to.equal(11000);
          expect(err.message).to.match(/duplicate key error/i);
          done();
        });
      });
    });
  });

  context('on success', () => {
    let user = null;

    it('creates a user', (done) => {
      user = new User({
        username: 'realuser123',
        password: '12345678'
      });

      user.save( (err, user) => {
        expect(err).not.to.exist;
        expect(user).to.be.an.instanceOf(User);
        done();
      });
    });

    it('assigns Mongo properties _id and __v', () => {
      expect(user._id).to.exist;
      expect(user.__v).to.exist;
    })

    it('sets createdAt and updatedAt properties automatically', () => {
      expect(user.createdAt).to.be.an.instanceOf(Date);
      expect(user.updatedAt).to.be.an.instanceOf(Date);
      expect(user.createdAt).to.equal(user.updatedAt);
    });

    it('encrypts the password', (done) => {
      bcrypt.compare( '12345678', user.password, (err, isCorrect) => {
        expect(err).not.to.exist;
        expect(isCorrect).to.equal(true);
        done();
      });
    });

    it('checks the encrypted password with #checkPassword', (done) => {
      user.checkPassword('12345678', (err, isCorrect) => {
        expect(err).not.to.exist;
        expect(isCorrect).to.equal(true);
        done();
      })
    })
  });

  context('on update', () => {
    let userId = null;

    before( (done) => {
      // Create a new user so we can test updating.
      User.create({
        username: 'toBeUpdated', password: '12345678'
      }, (err, user) => {
        userId = user._id;
        done();
      });
    });

    it('can update username', (done) => {
      setTimeout( () => {
        User.update({ _id: userId }, {
          username: 'updatedLady'
        }, (err, result) => {
          expect(err).not.to.exist;
          expect(result.ok).to.be.ok;
          expect(result.nModified).to.equal(1);
          done();
        });

      }, 1500)

    });

    it('has persisted the changes', (done) => {
      User.findById(userId, (err, user) => {
        expect(user.username).to.equal('updatedLady');
        done();
      });
    });

    // NOTE: Password updates are currently not supported, because of bcrypt.
    // Would be pretty easy to implement, I just haven't yet since that
    // functionality doesn't exist in the UI.
    xit('can update password', (done) => {
        User.update({ _id: userId }, {
          password: '87654321'
        }, (err, result) => {
          expect(err).not.to.exist;
          expect(result.ok).to.be.ok;
          expect(result.nModified).to.equal(1);
          done();
        });

    });


    it('has updated the updatedAt field', (done) => {
      User.findById(userId, (err, user) => {
        expect(user.updatedAt).to.be.greaterThan(user.createdAt);
        done();
      });
    });

  });
});
