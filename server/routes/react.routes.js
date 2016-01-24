import qs                         from 'qs';

import React                      from 'react';
import { renderToString }         from 'react-dom/server';
import { RoutingContext, match }  from 'react-router';
import { Provider }               from 'react-redux';

import createLocation             from 'history/lib/createLocation';

import clientRoutes               from '../../common/routes';
import configureStore             from '../../common/store';

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
      const initialState = store.getState().toJS();

      const InitialComponent = (
        <Provider store={store}>
          <RoutingContext {...renderProps} />
        </Provider>
      );
      const componentHTML = renderToString(InitialComponent);

      res.send( renderFullPage(componentHTML, initialState) );
    });
  }

  function renderFullPage(html, initialState) {
    return `
      <!doctype html>
      <html>
        <head>
          <title>Words With Strangers</title>
          <link rel="icon"
            href="https://s3.amazonaws.com/wordswithstrangers/favicon/favicon.png"
            sizes="128x128"
            type="image/png"
          />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />
          <link rel="stylesheet" href="/static/styles.css" />
          <script src="//use.edgefonts.net/cabin:n4,n5,n6,n7.js"></script>
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
