// There are three possible environments in which a store needs to be created:
//    1) On the server
//    2) On the client, in development (with DevTools/hot-reloading, etc)
//    3) On the client, in production
//
// On the server, we have access to process.env.NODE_ENV and
// process.env.UNIVERSAL_ENV. On the client, using webpack.providePlugin,
// they're injected in.
console.log("NODE", process.env.NODE_ENV, "UNIVERSAL", process.env.UNIVERSAL_ENV)

if ( process.env.UNIVERSAL_ENV === 'server' ) {
  module.exports = require('./configureStore.server');
} else if ( process.env.NODE_ENV === 'production' ) {
  module.exports = require('./configureStore.client_prod');
} else {
  module.exports = require('./configureStore.client_dev');
}
