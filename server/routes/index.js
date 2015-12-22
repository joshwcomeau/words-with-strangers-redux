import authRoutes   from './auth.routes';
import reactRoutes  from './react.routes';

export default function(app) {
  // By just calling all the route functions with the supplied app, we
  // connect each respective set of routes with our Express application.

  // Authentication routes (login, register)
  authRoutes(app);

  // Finally, the server-rendered React route. This is a catch-all, since
  // it relies on React-Router to do the routing from here.
  reactRoutes(app);
}
