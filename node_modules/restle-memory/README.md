# Restle In-Memory Adapter
In-memory persistence layer adapter used for [Restle](https://github.com/dcslack/restle).

[![npm version](https://badge.fury.io/js/restle-mongodb.svg)](http://badge.fury.io/js/restle-mongodb)
[![Build Status](https://travis-ci.org/dcslack/restle-mongodb.svg)](https://travis-ci.org/dcslack/restle-mongodb)

```sh
$ npm install restle --save
$ npm install restle-mongodb --save
```

```js
const Restle = require('restle');

// in-memory adapter comes shipped with the lib
const app = new Restle({
  namespace: 'api',
  port: 3000,
});

app.on('ready', () => {
  // In-memory adapter is connected
});
```
