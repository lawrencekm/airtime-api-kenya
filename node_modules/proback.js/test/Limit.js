let Proback = require('../lib/Proback')


Proback.limit( new Promise( (resolve, reject) => {
	setTimeout( () => {
		resolve( 'Promise finished' )
	}, 3000 )
} ), 2000 ).then( console.log ).catch( console.error )
