/* eslint-disable no-console, no-use-before-define */

import path                       from 'path';
import Express                    from 'express';
import qs                         from 'qs';

import webpack                    from 'webpack';
import webpackDevMiddleware       from 'webpack-dev-middleware';
import webpackHotMiddleware       from 'webpack-hot-middleware';
import webpackConfig              from '../webpack.config.js';

import React                      from 'react';
import { renderToString }         from 'react-dom/server';
import { RoutingContext, match }  from 'react-router';
import { Provider }               from 'react-redux';

import createLocation             from 'history/lib/createLocation';

import routes                     from '../common/routes';
import configureStore             from '../common/store/configureStore';
import { fetchTiles }             from '../common/lib/tiles.lib';

const app = new Express();
const port = 3000;

// Allow for hot module reloading via webpack
const compiler = webpack(webpackConfig);
app.use( webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}) );
app.use( webpackHotMiddleware(compiler) );


// Express middleware, fired on every request
app.use(handleRender);

function handleRender(req, res) {
  const location  = createLocation(req.url);
  const params    = qs.parse(req.query);

  match({routes, location}, (err, redirectLocation, renderProps) => {
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
        }
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
