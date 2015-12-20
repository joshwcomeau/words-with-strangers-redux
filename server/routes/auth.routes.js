// Authentication routes.
// Deals with registration, login, logout.
import nconf          from 'nconf';
import * as _         from 'lodash';

import jwt            from 'jsonwebtoken';
import passport       from 'passport';
import passportLocal  from 'passport-local';
import passportJwt    from 'passport-jwt';

import User           from '../models/user.model';

import { API_URLS }   from '../../common/constants/config.constants';


export default function(app) {
  app.use(passport.initialize());
  const LocalStrategy = passportLocal.Strategy;
  const JwtStrategy   = passportJwt.Strategy;
  const jwtOptions    = { secretOrKey: nconf.get('JWT_SECRET') };

  passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    User.findById(jwtPayload._id, (err, user) => {
      if (err)    return done(err, false);
      if (!user)  return done(null, false);
      else        return done(null, user);
    });
  }));


  app.get('/api/private_area', passport.authenticate('jwt', { session: false}),
    function(req, res) {
      res.json(req.user);
    }
  );

  app.post(API_URLS.authenticate, (req, res) => {
    console.log(req)
    console.log("Looking for user ", req.body.username)
    User.findOne({
      username: req.body.username
    }, (err, user) => {
      if (err)    throw err;
      if (!user)  return res.status(422).json({
        type:     'username_not_found',
        details:  "Sorry, we can't find any users with that username."
      });

      user.checkPassword( req.body.password, (err, isCorrect) => {
        if (err) throw err;

        if ( !isCorrect ) {
          return res.status(422).json({
            type:     'incorrect_password',
            details:  "That password is incorrect!"
          });
        }

        const token = jwt.sign({ _id: user._id }, nconf.get('JWT_SECRET'));

        return res.json({ user, token });
      });
    });
  });

  app.post('/api/register', (req, res) => {
    // TODO: Validations
    const selectedAnimalNum = _.random(1, 3);
    const animalPhotoUrl    = `https://s3.amazonaws.com/wordswithstrangers/animal-0${selectedAnimalNum}.png`

    const user = new User({
      username:     req.body.username,
      password:     req.body.password,
      profilePhoto: animalPhotoUrl
    });

    user.save( (err) => {
      if (err) {
        // Duplicate username.
        if ( err.toJSON().code === 11000 ) {
          return res.status(409).json({ type: 'duplicate_username' })
        } else {
          return res.status(400).json({ type: 'unknown_error' })
        }
      }

      // Generate a JWT for this new user, for use in subsequent requests.
      const token = jwt.sign({ _id: user._id }, nconf.get('JWT_SECRET'));

      return res.json({ user, token });
    });
  });
}
