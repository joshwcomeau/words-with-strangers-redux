// API routes
// Does not render or return HTML/JS. Only returns JSON.

import auth from './auth.routes';

export default function(app) {
  // By just calling all the route functions with the supplied app, we
  // connect each respective set of routes with our Express application.
  auth(app);
}
