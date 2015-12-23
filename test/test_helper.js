import { execSync }   from 'child_process';

import mongoose       from 'mongoose';
import nconf          from 'nconf';
import chai           from 'chai';
import chaiImmutable  from 'chai-immutable';

console.log("---- Tests starting! ----");
process.env.NODE_ENV = 'test';

import '../server/initialize';

chai.use(chaiImmutable);


// connect to and wipe the test DB
const dbName = nconf.get('DB_NAME');
const dbUrl  = nconf.get('DB_URL')
execSync(`mongo ${dbName} --eval "db.dropDatabase();"`);

mongoose.connect( dbUrl + dbName );
