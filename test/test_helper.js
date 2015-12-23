import { execSync }   from 'child_process';

import mongoose       from 'mongoose';
import nconf          from 'nconf';
import chai           from 'chai';
import chaiImmutable  from 'chai-immutable';

console.log("Default node env", process.env.NODE_ENV);

console.log("---- Tests starting! ----");
process.env.NODE_ENV = 'test';

import '../server/initialize';

chai.use(chaiImmutable);


// connect to and wipe the test DB
const testDb = nconf.get('MONGO_URL');
execSync("mongo #{testDb} --eval \"db.dropDatabase();\"");
console.log("---- Database wiped ----")

mongoose.connect( testDb );
