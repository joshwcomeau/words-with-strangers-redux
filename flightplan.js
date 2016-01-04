'use strict';

require('babel-core/register');
require('./server/initialize');

const plan  = require('flightplan');
const _     = require('lodash');
const nconf = require('nconf');

const privateKey = process.env.HOME + "/.ssh/id_rsa";

const appName = 'wordswithstrangers';
const tempDir = appName + '_' + new Date().getTime();


plan.target('production', {
  host:       nconf.get('SERVER_HOST'),
  username:   nconf.get('SERVER_USER'),
  privateKey: privateKey
});

plan.local( local => {
  // local.log('Webpacking everything up');
  // local.exec('webpack -p --config webpack.config.prod.js');



  const dist    = local.find('dist', {silent: true}).stdout.split('\n');
  const common  = local.find('common', {silent: true}).stdout.split('\n');
  const server  = local.find('server', {silent: true}).stdout.split('\n');
  const files   = [].concat(dist, common, server);

  console.log(files)

  local.log('Copying files to remote')
  local.transfer(files, `/tmp/${tempDir}`);
});
