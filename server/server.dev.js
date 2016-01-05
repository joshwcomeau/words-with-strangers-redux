import path                       from 'path';
import nconf                      from 'nconf';
import morgan                     from 'morgan';
import Express                    from 'express';
import mongoose                   from 'mongoose';
import bodyParser                 from 'body-parser';

import webpack                    from 'webpack';
import webpackDevMiddleware       from 'webpack-dev-middleware';
import webpackHotMiddleware       from 'webpack-hot-middleware';

import './initialize';

import webpackConfig              from '../webpack.config.dev.js';
import routes                     from './routes';
import sockets                    from './sockets';



const app   = new Express();
const port  = nconf.get('PORT');

const http  = require('http').Server(app);



  ////////////////////////////
 /////// MIDDLEWARES ////////
////////////////////////////
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

  ////////////////////////////
 ///////// DATABASE /////////
////////////////////////////
mongoose.connect( nconf.get('DB_URL') + nconf.get('DB_NAME') );



  ////////////////////////////
 ///////// WEBPACK //////////
////////////////////////////
// TODO: Figure out a production strategy
const compiler = webpack(webpackConfig);
app.use( webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}) );
app.use( webpackHotMiddleware(compiler) );


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
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
});
