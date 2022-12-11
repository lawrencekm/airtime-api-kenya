'use strict'

let chai = require('chai')
let expect = chai.expect

let Proback = require('../lib/Proback')

describe('Proback.js', function () {
	before(function (done) {
		done()
	})

	describe('Test Assign services', function () {
		it('Non recursive assign', function (done) {
			new Promise( function (resolve, reject) {
				Proback.handler( null, resolve, reject )(null, 'Done.')
			}).then( function (res) {
				expect(res).to.equal('Done.')
				done()
			})
		})
		it('Non recursive assign', function (done) {
			new Promise( function (resolve, reject) {
				var someCB = function (err, res) {
					if (err) return Proback.rejecter(err, null, reject)
					return Proback.resolver(res, null, resolve)
				}
				someCB( null, 'Done.' )
			}).then( function (res) {
				expect(res).to.equal('Done.')
				done()
			})
		})
	})

	after(function (done) {
		done()
	})
})
