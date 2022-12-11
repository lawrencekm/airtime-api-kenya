var Assigner = require('../lib/assign')
var assigner = new Assigner()

var a = {
	name: 'A',
	walking: function () {}
}
var b = {
	name: 'B',
	sulking: function () {}
}

assigner.blueprinting( true )
console.log( assigner.assign( a, b ) )
