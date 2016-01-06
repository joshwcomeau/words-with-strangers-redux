// There are three possible environments in which a store needs to be created:
//    1) On the server
//    2) On the client, in development (with DevTools/hot-reloading, etc)
//    3) On the client, in production

if ( process.env.UNIVERSAL_ENV === 'server' ) {
  module.exports = require('./configureStore.server');
} else if ( process.env.NODE_ENV === 'production' ) {
  module.exports = require('./configureStore.client_prod');
} else {
  module.exports = require('./configureStore.client_dev');
}
