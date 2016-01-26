import { execSync }   from 'child_process';

import mongoose       from 'mongoose';
import nconf          from 'nconf';
import chai           from 'chai';
import chaiImmutable  from 'chai-immutable';
import equalJSX       from 'chai-equal-jsx';
import sinonChai      from 'sinon-chai';


console.info("------ Setting up! ------");
process.env.NODE_ENV = 'test';

import '../server/initialize';

chai.use(chaiImmutable);
chai.use(equalJSX);
chai.use(sinonChai);

// connect to and wipe the test DB
const dbName = nconf.get('DB_NAME');
const dbUrl  = nconf.get('DB_URL')

console.info("---- Wiping Database ----");
execSync(`mongo ${dbName} --eval "db.dropDatabase();"`);

console.info('---- Tests Starting -----');
mongoose.connect( dbUrl + dbName );
