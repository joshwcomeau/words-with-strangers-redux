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

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// Database stuff
// TODO: Use a cloud mongo provider.
mongoose.connect( nconf.get('MONGO_URL') );



// Allow for hot module reloading via webpack
// TODO: Figure out a production strategy
const compiler = webpack(webpackConfig);
app.use( webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}) );
app.use( webpackHotMiddleware(compiler) );

// Api and React server-rendered routes
routes(app);

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
});
