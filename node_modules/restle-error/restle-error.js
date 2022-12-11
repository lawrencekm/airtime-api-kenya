'use strict';

const util = require('util');

function RestleError(options) {
  if (undefined === options)
    throw new TypeError('The options argument must be a valid object.');

  Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;

  this.status = options.status || 0;
  this.id = options.id || '';
  this.code = options.code || '';
  this.title = options.title || '';
  this.detail = options.detail || '';
  this.meta = options.meta || '';
};

RestleError.prototype.serialize = function serialize() {
  const status = this.status;
  const title = this.title;
  const id = this.id;
  const detail = this.detail;
  const meta = this.meta;
  const code = this.code;

  const error = {};

  if (id) error.id = id;
  if (detail) error.detail = detail;
  if (status) error.status = status;
  if (title) error.title = title;
  if (meta) error.meta = meta;
  if (code) error.code = code;

  return {
    errors: [ error ],
  }
}

util.inherits(RestleError, Error);
module.exports = RestleError;
