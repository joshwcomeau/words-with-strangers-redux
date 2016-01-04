'use strict';

require('babel-core/register');
require('./server/initialize');

const plan    = require('flightplan');
const _       = require('lodash');
const nconf   = require('nconf');
const moment  = require('moment');

const privateKey    = process.env.HOME + "/.ssh/id_rsa";

const user          = 'deploy';
const appName       = 'wordswithstrangers';
const newDirectory  = 'wws_' + moment().format('DD-MM-YYYY_hh[h]mm[m]ss[s]');

const sourceDest    = `/tmp/${newDirectory}`;
const targetDest    = `/home/${user}/${appName}/${newDirectory}`;
const linkedDest    = `/home/${user}/${appName}/current`;


plan.target('production', {
  host:       nconf.get('SERVER_HOST'),
  username:   nconf.get('SERVER_USER'),
  agent: process.env.SSH_AUTH_SOCK
});

plan.local( local => {
  local.log(`Deployment started! Deploying to ${newDirectory}`)
  local.log('Webpacking everything up');
  local.exec('webpack -p --config webpack.config.prod.js');

  // Yay working with filesystems. How I miss regex.
  local.log('Copying files to remote')
  const dist      = local.find('dist', {silent: true}).stdout.split('\n');
  const common    = local.find('common', {silent: true}).stdout.split('\n');
  const server    = local.find('server', {silent: true}).stdout.split('\n');
  const packjson  = local.find('package.json', {silent: true}).stdout.split('\n');
  const files     = [].concat(dist, common, server, packjson);
  local.transfer(files, `/tmp/${newDirectory}`);
});

plan.remote( remote => {
  remote.log('Move folder to web root')
  remote.sudo(`cp -R ${sourceDest} ${targetDest}`, { user });
  remote.rm(`-rf ${sourceDest}`); // clean up after ourselves

  remote.log('Installing dependencies');
  // TODO: Dependency caching.
  remote.sudo(
    `npm --production --prefix ${targetDest} install ${targetDest}`,
    { user }
  );

  remote.log('Creating symlink');
  remote.sudo(`ln -snf ${targetDest} ${linkedDest}`, { user });

  remote.log('Reloading application');
  // TODO
});
