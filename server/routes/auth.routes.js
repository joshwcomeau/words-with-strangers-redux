// Authentication routes.
// Deals with registration, login, logout.
import nconf            from 'nconf';
import * as _           from 'lodash';

import jwt              from 'jsonwebtoken';
import passport         from 'passport';
import passportLocal    from 'passport-local';
import passportJwt      from 'passport-jwt';
import passportTwitter  from 'passport-twitter';

import User             from '../models/user.model';


export default function(app) {
  app.use(passport.initialize());
  const LocalStrategy   = passportLocal.Strategy;
  const JwtStrategy     = passportJwt.Strategy;
  const TwitterStrategy = passportTwitter.Strategy;
  const jwtOptions      = { secretOrKey: nconf.get('JWT_SECRET') };


  // ============
  // JWT ========
  // ============
  passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    User.findById(jwtPayload.id, (err, user) => {
      if (err)    return done(err, false);
      if (!user)  return done(null, false);
      else        return done(null, user);
    });
  }));

  // ============
  // TWITTER ====
  // ============
  passport.use(new TwitterStrategy({
    consumerKey:      nconf.get('TWITTER_API_KEY'),
    consumerSecret:   nconf.get('TWITTER_API_SECRET'),
    callbackURL:      nconf.get('TWITTER_CALLBACK')
  }, (token, tokenSecret, profile, done) => {
    process.nextTick( () => {
      User.findOne({ twitterId: profile.id }, (err, user) => {
        if (err) return done(err);

        if ( user ) {
          // We successfully authenticated!
          // TODO: Move this to middleware.
          const userJson = _.pick(user.toJSON(), ['id', 'username', 'profilePhoto']);

          const token = jwt.sign(userJson, nconf.get('JWT_SECRET'));

          return res.json({ token });
        }
      })
    })
  }));

  app.post('/api/authenticate', (req, res) => {
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

        // TODO: Move this to middleware.
        const userJson = _.pick(user.toJSON(), ['id', 'username', 'profilePhoto']);

        const token = jwt.sign(userJson, nconf.get('JWT_SECRET'));

        return res.json({ token });
      });
    });
  });

  app.post('/api/register', (req, res) => {
    // TODO: Validations
    let selectedAnimalNum = _.random(1, 20);

    // Make it zero-padded
    if ( selectedAnimalNum < 10 ) selectedAnimalNum = `0${selectedAnimalNum}`;

    const animalPhotoUrl    = `https://s3.amazonaws.com/wordswithstrangers/animal-${selectedAnimalNum}.png`

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
      const token = jwt.sign(user.toJSON(), nconf.get('JWT_SECRET'));

      return res.json({ token });
    });
  });
}
