/* eslint-disable no-console, no-use-before-define */

import path                 from 'path';
import Express              from 'express';
import qs                   from 'qs';

import webpack              from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig        from '../webpack.config.js';

import React                from 'react';
import { renderToString }   from 'react-dom/server';
import { Provider }         from 'react-redux';

import configureStore       from '../common/store/configureStore';
import App                  from '../common/containers/App';
import { fetchTiles }       from '../common/lib/tiles.lib';

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
  const params = qs.parse(req.query);

  const tiles = fetchTiles(8);



  // compile an initial state
  const initialState = {
    game: {
      board: [],
      rack: tiles
    }
  };

  const store = configureStore(initialState);

  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const finalState = store.getState();

  res.send( renderFullPage(html, finalState) );

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
