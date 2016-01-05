import path                       from 'path';
import nconf                      from 'nconf';
import morgan                     from 'morgan';
import Express                    from 'express';
import mongoose                   from 'mongoose';
import bodyParser                 from 'body-parser';

import './initialize';

import routes                     from './routes';
import sockets                    from './sockets';



const app   = new Express();
const port  = nconf.get('PORT');

const http  = require('http').Server(app);



  ////////////////////////////
 /////// MIDDLEWARES ////////
////////////////////////////
// use body parser so we can get info from POST and/or URL parameters
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );

// use morgan to log requests to the console
app.use( morgan('dev') );

// Allow static files in the /static directory
app.use( '/static', Express.static('dist') )

  ////////////////////////////
 ///////// DATABASE /////////
////////////////////////////
mongoose.connect( nconf.get('DB_URL') + nconf.get('DB_NAME') );



  ////////////////////////////
 ////////// ROUTES //////////
////////////////////////////
routes(app);

  ////////////////////////////
 //////// WEBSOCKETS ////////
////////////////////////////
sockets(http);


http.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}.`);
  }
});
