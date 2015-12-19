// Authentication routes.
// Deals with registration, login, logout.
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
  }
  passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    User.findOne({
      _id: jwtPayload.sub
    }, (err, user) => {
      if (err)    return done(err, false);
      if (!user)  return done(null, false);
      else        return done(null, user);
    });
  }));


  app.post('/api/authenticate', (req, res) => {
    return res.json({
      success: true
    });
  });

  app.post('/profile', passport.authenticate('jwt', { session: false}),
    function(req, res) {
      res.send(req.user.profile);
    }
  );

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
