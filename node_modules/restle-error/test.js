const Promise = require('bluebird');
const test = require('tape');
const errors = require('./index');

const NotFoundError = errors.NotFoundError;
const ConflictError = errors.ConflictError;

function throwNotFound() {
  throw new NotFoundError({
    type: 'user',
    id: 1,
  });
}

function throwConflict() {
  throw new ConflictError({
    first: 'user',
    second: 'animal',
  });
}

test('test errors', assert => {
  try {
    throwNotFound();
  } catch(err) {
    assert.ok(err instanceof Error, 'err is an instance of Error');
    assert.ok(err instanceof NotFoundError, 'err is an instance of NotFoundError');
    assert.notOk(err instanceof ConflictError, 'err is not an instance of ConflictError');
    assert.equal(err.name, 'NotFoundError', 'error has proper name');

    assert.deepEqual(err.serialize(), {
      errors: [{
        status: 404,
        detail: `A resource with type 'user' and id '1' was not found.`,
        title: `Resource not found`,
      }]
    }, 'serialized error has proper json');

    assert.end();
  }
});

test('test bluebird (1)', assert => {
  Promise
    .try(throwConflict)
    .catch(ConflictError, err => {
      assert.ok(err, 'caught the conflict error');
      assert.end();
    });
});

test('test bluebird (2)', assert => {
  Promise
    .try(throwNotFound)
    .catch(ConflictError, err => {
      assert.fail('should not be here');
    })
    .catch(NotFoundError, err => {
      assert.ok(err, 'caught the not found error');
      assert.end();
    });
});

test('test bluebird (2)', assert => {
  Promise
    .try(throwNotFound)
    .catch(err => {
      assert.ok(err, 'universal error catch worked');
      assert.end();
    });
});
