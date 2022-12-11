let stopper = async function ( promise ) {
	let timestamp = Date.now()
	await promise
	return Date.now() - timestamp
}

console.log( stopper( new Promise( () => {} ) ) )


let failer = async function ( ) {
	let timestamp = Date.now()
	return Date.now() - timestamp
}
console.log( failer( ) )
