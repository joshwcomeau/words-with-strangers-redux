/*
  Any shared initialization needed for server.js, workers, or independent
  scripts goes here
*/
import fs     from 'fs';
import nconf  from 'nconf';
import * as _ from 'lodash';

const DEFAULT_CONFIG  = './server/config/default.json';
const PRIVATE_CONFIG  = './server/config/private.json';


// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. Our private config (secret keys, etc)
//   4. Our default configuration, in a json file
nconf
  .argv()
  .env()
  .file('private', PRIVATE_CONFIG)
  .file('default', DEFAULT_CONFIG);

// Always use EST. Makes my life easier.
process.env.TZ = 'EST';
