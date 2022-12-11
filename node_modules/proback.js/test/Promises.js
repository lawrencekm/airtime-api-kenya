let Proback = require('../lib/Proback')

function a ( callback ) {
	return new Promise( function (resolve, reject) {
		resolve( 2 )
	} )
}

function b ( callback ) {
	return new Promise( (resolve, reject) => {
		resolve( 5 )
	} )
}

function e ( callback ) {
	return new Promise( (resolve, reject) => {
		reject( new Error( 'Ehhhhh' ) )
	} )
}

function all () {
	return Promise.all( [ a(), b() ] )
}
var pro = all()
pro.then( (res) => { console.log('>>>>>', res) } )
	.catch( (reason) => { console.error(reason) } )

function allCB ( callback ) {
	var promises = [ a(), b() ]
	return Proback.forAll( promises, callback )
}

allCB( function (err, res) {
	console.log( '----', err, res )
} )

var proCB = allCB()
proCB.then( (res) => { console.log('....', res) } )
	.catch( (reason) => { console.error(reason) } )
