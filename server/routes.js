// API routes
// Does not render or return HTML/JS. Only returns JSON.
import User from './models/user.model';


export default function(app) {
  app.post('/api/authenticate', (req, res) => {
    return res.json({
      success: true
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
