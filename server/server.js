import qs                         from 'qs';
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

import React                      from 'react';
import { renderToString }         from 'react-dom/server';
import { RoutingContext, match }  from 'react-router';
import { Provider }               from 'react-redux';

import createLocation             from 'history/lib/createLocation';

import User                       from './models/user.model';

import serverRoutes               from './routes'
import clientRoutes               from '../common/routes';
import configureStore             from '../common/store/configureStore';
import { fetchTiles }             from '../common/lib/tiles.lib';

import './initialize';

const app   = new Express();
const port  = nconf.get('PORT');

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// Database stuff
// TODO: Use a cloud mongo provider.
mongoose.connect( nconf.get('MONGO_URL') );



// use API Routes
serverRoutes(app);


// Allow for hot module reloading via webpack
// TODO: Figure out a production strategy
const compiler = webpack(webpackConfig);
app.use( webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}) );
app.use( webpackHotMiddleware(compiler) );


// app.post('/login',
//   passport.authenticate('local', { session: false }),
//   (req, res) => {
//     console.log("LOGIN ROUTE HIT")
//   }
// );

// Every other request should be passed off to React Router to server-render
// and send down to the client
app.get('*', handleRender);

function handleRender(req, res) {
  const location  = createLocation(req.url);
  const params    = qs.parse(req.query);

  match({routes: clientRoutes, location}, (err, redirectLocation, renderProps) => {
    if (err) {
      console.error(err);
      return res.status(500).end('Internal server error D:');
    }

    if ( !renderProps ) return res.status(404).end('Not found.');


    // compile an initial state
    // TODO: Remove this. Just for testing.
    const initialState = {
      game: {
        board: [],
        rack: fetchTiles(8),
        status: {
          isMyTurn: true
        },
        players: [{
          _id: '1',
          profilePhoto: 'https://pbs.twimg.com/profile_images/378800000532546226/dbe5f0727b69487016ffd67a6689e75a.jpeg',
          username: 'BestWorderEvah',
          points: 3
        }, {
          _id: '2',
          profilePhoto: 'http://cdn2.business2community.com/wp-content/uploads/2014/10/Sushi-Cat-Halloween-Costume2.jpg2.jpg',
          username: 'SushiCat',
          points: 8
        }]
      },
      currentUser: {
        _id: '2',
        profilePhoto: 'http://cdn2.business2community.com/wp-content/uploads/2014/10/Sushi-Cat-Halloween-Costume2.jpg2.jpg',
        username: 'SushiCat'
      }
    };

    const store = configureStore(initialState);
    const finalState = store.getState();

    const InitialComponent = (
      <Provider store={store}>
        <RoutingContext {...renderProps} />
      </Provider>
    );
    const componentHTML = renderToString(InitialComponent);

    res.send( renderFullPage(componentHTML, finalState) );
  });
}

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Words With Strangers</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
});
