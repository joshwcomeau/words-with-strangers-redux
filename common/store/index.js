// There are three possible environments in which a store needs to be created:
//    1) On the server
//    2) On the client, in development (with DevTools/hot-reloading, etc)
//    3) On the client, in production

console.log("UNIVERSAL ENV IS", process.env.UNIVERSAL_ENV)

if ( process.env.UNIVERSAL_ENV === 'server' ) {
  module.exports = require('./configureStore.client');
} else {
  module.exports = require('./configureStore.client');
}
