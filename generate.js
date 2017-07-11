'use strict';

const chalk = require('chalk');
const log = console.log;
const dir = (f, opts) => console.dir(f, Object.assign({}, {
  colors: true,
  depth: null
}), opts);
const test = require('./test');

const generateMongoUpdate = record => {
  const recId = record._id;
  delete record._id;
  log(`
    db.evws.update(
      { _id: ObjectId("${recId}") },
      {
        $set: ${JSON.stringify(record, null, 2)}
      })`);
}

test()
  .then(data => {
    log(`${chalk.green('record is valid')}`)
    generateMongoUpdate(data);
  })
  .catch(result => log(`${chalk.red('invalid record, are you sure you want to generate a mongo update?')}`));
