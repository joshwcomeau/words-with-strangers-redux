// Simple wrapper for server.js, to allow ES6 on the server-side.
require('babel-core/register');

var nconf = require('nconf');

var env         = nconf.get('NODE_ENV');
var fileSuffix  = env === 'development' ? '.dev' : '.prod';
var fileName    = './server'+fileSuffix; // eg. ./server.dev

require(fileName);
