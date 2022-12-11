const sequential = require('../lib/Proback').syncAll
const array = [1, 2, 3, 4, 5]

sequential(array.map((item) => {
	return function (previousResponse, responses, count) {
		return new Promise( (resolve) => {
			setTimeout(() => {
				resolve(item)
			}, 1000)
		})
	}
}))
.then( (res) => {
	console.log('....', res)
})
.catch( (err) => {
	console.error('>>>', err)
})
