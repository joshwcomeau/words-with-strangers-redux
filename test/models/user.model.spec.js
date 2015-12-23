import { expect } from 'chai';
import * as _     from 'lodash';

import User from '../../server/models/user.model';


describe('User model', () => {
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

  it('fails without a password', (done) => {
    const user = new User({
      username: 'hiya'
    });

    user.save( (err) => {
      expect(err).to.exist;
      expect(err.name).to.equal('ValidationError');
      expect(err.errors).to.include.key('password');
      expect(err.errors.password.kind).to.equal('required');

      done()
    });
  });

  it('succeeds with both a username and password', (done) => {
    const user = User.create({
      username: 'hiya',
      password: '12345678'
    }, (err, user) => {
      console.log(err, user)
      done();
    });


  });
});
