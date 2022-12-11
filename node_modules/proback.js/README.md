proback.js - dependency-free very minimal helper for APIs with Promise/callback dual design

[![NPM](https://nodei.co/npm/assign.js.png)](https://nodei.co/npm/proback.js/)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

========

[proback.js](https://github.com/imrefazekas/proback.js) is an extremely tiny helper library to help the creation of APIs where functions are aimed to enable Promise-based and callback-based design as well.

[Usage](#usage)
[Rules](#rules)


## Usage

Command line:

	npm install proback.js --save

In JS code:

```javascript
	var Proback = require('proback.js');
	...
	// your service. If callback is present, works as expected, If not, promise will be provided.
	function yourService( data, callback ){
		new Promise( function (resolve, reject) {
			//some callback is needed?
			object.fnCallWithCallback( data, Proback.handler( null, resolve, reject ) )
		}).then( function (res) {
			expect(res).to.equal('Done.')
			done()
		})
	}
```

```javascript
	var Proback = require('proback.js');
	...
	// your service. If callback is present, works as expected, If not, promise will be provided.
	function yourService( data, callback ){
		return new Promise( function (resolve, reject) {
			//some callback is needed?
			object.fnCallWithCallback( data, function (err, res) {
				if (err) return Proback.rejecter(err, null, reject)
				// some operation
				return Proback.resolver(res, null, resolve)
			} )
		}).then( function (res) {
			expect(res).to.equal('Done.')
			done()
		})
	}
```


## Rules

- quicker ( res, callback )
	Defines a simple promise to send a result through the optional callback as well

- thrower ( err, callback )
	Defines a simple promise to throw an error through the optional callback as well

- syncAll (promises)
	Performes all promises in order

- forAll ( promises, callback, defaultRes )
	Performes all promises and channel the result to the given callback

- handler ( callback, resolve, reject )
	Defines a callback function, which will use the passed opional callback and promise functions to channel the results

- returner ( err, res, callback, resolve, reject )
	Error mades it mark the error through the optional callback and the optional reject function or send the result back to the optional callback or the optional resolve function

- resolver (res, callback, resolve)
	Sends a result through the optional callback and the optional reject function

- rejecter (err, callback, reject)
	Marks an error through the optional callback and the optional reject function