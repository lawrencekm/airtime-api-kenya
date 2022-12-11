const RestleError = require('./restle-error');
const util = require('util');

AdapterError = function(options) {
  const type = options.type;
  const meta = options.meta;
  const reason = options.reason;

  this.status = 500;
  this.name = `AdapterError`;
  this.title = `Adapter failed to connect`;
  this.detail = `The ${type} adapter failed to properly connect. Reason: ${reason}`;
}

BadRequestError = function(options) {
  const detail = options.detail;

  this.status = 400;
  this.name = 'BadRequestError';
  this.title = 'Bad request';
  this.detail = detail;
}

ConflictError = function(options) {
  const first = options.first;
  const second = options.second;

  this.status = 409;
  this.name = `ConflictError`;
  this.title = `Conflicting values`;
  this.detail = `Tried to perform an operation on mismatched types: ${first} and ${second}`;
}

NotFoundError = function(options) {
  const type = options.type;
  const id = options.id;

  this.status = 404;
  this.name = `NotFoundError`;
  this.title = `Resource not found`;
  this.detail = `A resource with type '${type}' and id '${id}' was not found.`;
}

RelationshipError = function(options) {
  const type = options.type;
  const method = options.method;
  const target = options.target;

  this.status = 400;
  this.name = `RelationshipError`;
  this.title = `Relationship error`;
  this.detail = `You cannot ${method} a ${type} relationship with a ${target}.`;
}

util.inherits(AdapterError, RestleError);
util.inherits(BadRequestError, RestleError);
util.inherits(ConflictError, RestleError);
util.inherits(NotFoundError, RestleError);
util.inherits(RelationshipError, RestleError);

module.exports = {
  AdapterError: AdapterError,
  BadRequestError: BadRequestError,
  ConflictError: ConflictError,
  NotFoundError: NotFoundError,
  RelationshipError: RelationshipError,
}
