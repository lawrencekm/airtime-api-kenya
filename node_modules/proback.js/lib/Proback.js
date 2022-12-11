module.exports = {
	promisify: function (obj, fn, ...params) {
		return new Promise( (resolve, reject) => {
			params.push( (err, res) => {
				if (err) reject(err)
				else resolve( res )
			} )
			fn.call( obj, ...params )
		} )
	},
	stopper: async function ( promise ) {
		let timestamp = Date.now()
		await promise
		return Date.now() - timestamp
	},
	timeout: function (ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	},

	limit: function ( promise, max = -1 ) {
		let timeoutId
		const timeoutPromise = new Promise((resolve, reject) => {
			timeoutId = setTimeout(() => { resolve( ) }, max )
		})
		const freePromise = new Promise((resolve, reject) => {
			promise.then( (res) => {
				clearTimeout( timeoutId )
				resolve(res)
			} ).catch( reject )
		} )
		return Promise.race([ freePromise, timeoutPromise ])
	},

	untilAsync: function ( fn, ms = 100, max = -1 ) {
		return new Promise( (resolve, reject) => {
			let time = Date.now()
			let pingInterval = setInterval( async function () {
				try {
					let res = await fn()
					if ( res ) {
						clearInterval( pingInterval )
						resolve( res )
					}
					else if ( max > -1 && (Date.now() - time) >= max ) {
						clearInterval( pingInterval )
						reject( new Error( 'Function never made it in ' + max + ' ms' ) )
					}
				} catch (err) {
					clearInterval( pingInterval )
					reject( new Error( err ) )
				}
			}, ms )
		} )
	},
	until: function ( fn, ms = 100, max = -1 ) {
		return new Promise( (resolve, reject) => {
			let time = Date.now()
			let pingInterval = setInterval( function () {
				if ( fn() ) {
					clearInterval( pingInterval )
					resolve()
				}
				else if ( max > -1 && (Date.now() - time) >= max ) {
					clearInterval( pingInterval )
					reject( new Error( 'Function never made it in ' + max + ' ms' ) )
				}
			}, ms )
		} )
	},
	performer: function (promise, callback, resolve, reject) {
		promise
			.then( (res) => { module.exports.resolver(res, callback, resolve) } )
			.catch( (reason) => { module.exports.rejecter(reason, callback, reject) } )
	},
	embracer: function (promise, callback) {
		return new Promise( (resolve, reject) => {
			promise
				.then( (res) => { module.exports.resolver(res, callback, resolve) } )
				.catch( (reason) => { module.exports.rejecter(reason, callback, reject) } )
		} )
	},
	quicker: function ( res, callback ) {
		return new Promise( (resolve, reject) => {
			if (callback) callback( null, res )
			resolve(res)
		} )
	},
	thrower: function ( err, callback ) {
		return new Promise( (resolve, reject) => {
			if (callback) callback( err )
			reject(err)
		} )
	},
	syncAll: function (promises) {
		if (!Array.isArray(promises)) {
			throw new Error('First argument need to be an array of Promises')
		}

		return new Promise((resolve, reject) => {
			let count = 0
			let results = []

			const iterateeFunc = (previousPromise, currentPromise) => {
				return previousPromise
					.then(function (result) {
						if (count++ !== 0) results = results.concat(result)
						return currentPromise(result, results, count)
					})
					.catch((err) => {
						return reject(err)
					})
			}

			promises = promises.concat(() => { return Promise.resolve() } )

			promises
				.reduce(iterateeFunc, Promise.resolve(false))
				.then(function (res) {
					resolve(results)
				})
		})
	},
	forAll: function ( promises, callback, defaultRes ) {
		return new Promise( (resolve, reject) => {
			Promise.all( promises )
				.then( (res) => {
					if (callback) callback(null, defaultRes || res)
					resolve( defaultRes || res )
				} )
				.catch( (reason) => {
					if (callback) callback(reason)
					reject( reason )
				} )
		} )
	},
	handler: function ( callback, resolve, reject ) {
		return function (err, res) {
			if ( err ) {
				callback && callback( err, null )
				reject && reject(err)
			}
			else {
				callback && callback( null, res )
				resolve && resolve(res)
			}
		}
	},
	returner: function ( err, res, callback, resolve, reject ) {
		if ( err ) {
			callback && callback( err, null )
			reject && reject(err)
		}
		else {
			callback && callback( null, res )
			resolve && resolve(res)
		}
	},
	resolver: function (res, callback, resolve) {
		callback && callback( null, res )
		resolve && resolve( res )
	},
	rejecter: function (err, callback, reject) {
		callback && callback( err, null )
		reject && reject( err )
	}
}
