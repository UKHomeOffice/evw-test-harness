'use strict';

const chalk = require('chalk');
const Validator = require('jsonschema').Validator;
const transform = require('evw-schemas').evw.hof.transform;
const schema = require('evw-schemas').evw.mainForm.schema;
const data = require('./evws/test');
const v = new Validator();
const log = console.log;
const dir = (f, opts) => console.dir(f, Object.assign({}, {
  colors: true,
  depth: null
}), opts);

dir(schema);

debugger;

const validate = (data, schema) => {
  const result = v.validate(data, schema);
  if (result.valid) {
    return Promise.resolve(result);
  }
  return Promise.reject(result);
};

const testApplication = () => {
  transform
  .transformData(data)
  .then(transformedData => {
    log(chalk.cyan('Testing application...'));
    log(chalk.cyan('transformed data:'));
    console.dir(transformedData, {colors: true});
    log(chalk.cyan('-----'));
    validate(transformedData, schema)
    .then(data => log(`
      ${chalk.green('record is valid')}
      ${data}
    `))
    .catch(result => {
      log(chalk.yellow(`record has failed validation

validation errors:`));
      result.errors.forEach((error, i) => {
        log(`
⁍ ${i+1}: ${chalk.red(error)}
        `);
        console.dir(error, {
          colors: true,
          depth: 4
        });
      });
    });
  })
  .catch(e => {
    console.error('error', e);
  });
};

testApplication();

const testing = () => {
  return transform.transformData(data)
  .then(transformed => {
    return validate(transformed, schema)
      .then(rec => Promise.resolve(data))
      .catch(result => Promise.reject(result));
  });
}

module.exports = testing;
