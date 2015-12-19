// Authentication routes.
// Deals with registration, login, logout.
import nconf          from 'nconf';

import jwt            from 'jsonwebtoken';
import passport       from 'passport';
import passportLocal  from 'passport-local';
import passportJwt    from 'passport-jwt';

import User           from '../models/user.model';


export default function(app) {
  app.use(passport.initialize());
  const LocalStrategy = passportLocal.Strategy;
  const JwtStrategy   = passportJwt.Strategy;

  const jwtOptions = {
    secretOrKey: nconf.get('JWT_SECRET')
  };

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

  app.post('/api/authenticate', (req, res) => {
    User.findOne({
      username: req.body.username
    }, (err, user) => {
      if (err)    throw err;
      if (!user)  return res.status(422).json({ type: 'username_not_found' });

      // Check the password. TODO: Use bcrypt
      if ( user.password !== req.body.password )
        return res.status(422).json({ type: 'incorrect_password' });

      const token = jwt.sign({ _id: user._id }, nconf.get('JWT_SECRET'));

      return res.json({
        success: true,
        token
      });
    });
  });

  app.post('/api/register', (req, res) => {
    // TEMPORARY: Create a sample user
    var tempUser = new User({
      username: 'joshu',
      password: 'password'
    });

    tempUser.save( (err) => {
      if (err) throw err;

      console.log("Saved user!");
      return res.json(tempUser)
    });
  });
}
