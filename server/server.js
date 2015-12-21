import path                       from 'path';
import nconf                      from 'nconf';
import morgan                     from 'morgan';
import Express                    from 'express';
import mongoose                   from 'mongoose';
import bodyParser                 from 'body-parser';

import webpack                    from 'webpack';
import webpackDevMiddleware       from 'webpack-dev-middleware';
import webpackHotMiddleware       from 'webpack-hot-middleware';
import webpackConfig              from '../webpack.config.js';

import routes                     from './routes'

import './initialize';

const app   = new Express();
const port  = nconf.get('PORT');

const http  = require('http').Server(app);
const io    = require('socket.io')(http);

import * as Actions from '../common/constants/actions.constants';


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
// TODO: Use a cloud mongo provider.
mongoose.connect( nconf.get('MONGO_URL') );



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
io.on('connection', (socket) => {
  console.log("\nA user connected!\n\n")

  socket.on('disconnect', () => console.log("Client disconnected"))

  // Send the user the initial list of games
  const games = [
    {
      _id: 1,
      createdAt: '2015-12-21T16:00:00-05:00',
      title: 'Wording Around',
      status: 'playing',
      players: [{
        _id: '123',
        username: 'Susan Smithy',
        profilePhoto: 'https://s3.amazonaws.com/wordswithstrangers/animal-03.png'
      }, {
        _id: '456',
        username: 'Johnny Ive',
        profilePhoto: 'https://s3.amazonaws.com/wordswithstrangers/animal-01.png'
      }]
    }, {
      _id: 2,
      createdAt: '2015-12-21T15:54:12-05:00',
      title: 'Come spell!',
      status: 'waiting',
      players: [{
        _id: '789',
        username: 'Spellington',
        profilePhoto: 'https://s3.amazonaws.com/wordswithstrangers/animal-02.png'
      }]
    }

  ];

  socket.emit(Actions.ADD_GAMES_TO_LIST, games);

})


http.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
});
