import qs                         from 'qs';

import React                      from 'react';
import { renderToString }         from 'react-dom/server';
import { RoutingContext, match }  from 'react-router';
import { Provider }               from 'react-redux';

import createLocation             from 'history/lib/createLocation';

import clientRoutes               from '../../common/routes';
import configureStore             from '../../common/store/configureStore.server';

export default function(app) {

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

      const store = configureStore();
      const state = store.getState();

      const InitialComponent = (
        <Provider store={store}>
          <RoutingContext {...renderProps} />
        </Provider>
      );
      const componentHTML = renderToString(InitialComponent);

      res.send( renderFullPage(componentHTML, state) );
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
}
