Assign.js - dependency-free very minimal assign function

[![NPM](https://nodei.co/npm/assign.js.png)](https://nodei.co/npm/assign.js/)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

========

[Assign.js](https://github.com/imrefazekas/assign.js) is an extremely tiny helper function to assign objects

[Usage](#usage)
[Rules](#rules)


## Usage

Command line:

	npm install assign.js --save

In JS code:

	var assigner = require('assign.js');
	...
	assigner.assign( obj1, obj2[, obj3[, objN]] );

Respect will force assignment if property already exist


## Options:

	assigner.validvalues( true )

[Assign.js](https://github.com/imrefazekas/assign.js) will set only non 'null'-like values from source object. False by default.

	assigner.respect( true )

[Assign.js](https://github.com/imrefazekas/assign.js) will respect the already existing non-empty values of keys. False by default.

	assigner.recursive( true )

Tells assigner to walk recursively when assigning objects. Yes by default.

	assigner.attributes( [] )

Defines the list of keys allowed to be assigned.

	assigner.attributes( [] )

Defines the list of keys excluded to be assigned.

	assigner.primitives( [] )

Defines the list of keys considered as values to be assigned preventing to recursively processed.

	assigner.blueprinting( true )

If it is set to 'true', [Assign.js](https://github.com/imrefazekas/assign.js) will consider the keyset of the destination object as reference otherwise key-set will be read from the object assigned from.

	assigner.forceful( true )

This option will follow the path of the source object eventually overwriting the one found in the dest object.


## Other services:

	assigner.pick(object, properties)

This will project the object into a new object possessing the properties defined by the 2nd parameter which might be given as array or varargs as well.

	assigner.cloneObject( source )

This created a cloned object from the source copied recursively.

	assigner.mask( source, mask )

This created an object with the references only allowed by the mask object.

	assigner.purify( source, mask )

This created an object with the references only not denifed by the mask object.
