import RestleMemory from '../../../dist/lib/index';
import Restle from 'restle';
import Promise from 'bluebird';
import test from 'tape';
import schemas from '../fixtures/restle-schemas';

import runTest from './runTest';

const adapter = new RestleMemory();
const app = new Restle({ namespace: 'api', port: 1337, adapter });

app.register({
  person: schemas.person,
  animal: schemas.animal,
});

app.on('ready', () => {
  console.log('App is ready!');

  // adapter -> model -> router
  test('adapter tests', t => {
    const models = {
      person: app.model('person'),
      animal: app.model('animal'),
    };

    runTest(t, app, models).then(success => {
      t.ok(success, 'adapter tests were successful');
      t.end();
    });
  });

  test('teardown', t => {
    app.disconnect().then(() => {
      t.pass('app disconnected');
      t.end();
    });
  });
});
