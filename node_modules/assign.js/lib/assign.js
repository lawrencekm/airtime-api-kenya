const _ = require('isa.js')

function Assigner ( options ) {
	this.init( options )
}

const assigner = Assigner.prototype

assigner.init = function (options) {
	this.options = options || {}
	this.options.recursive = true
	return this
}

assigner.logger = function ( logger ) {
	this.options.logger = logger
	return this
}

assigner.validvalues = function ( validvalues ) {
	this.options.validvalues = validvalues
	return this
}

assigner.respect = function ( respect ) {
	this.options.respect = respect
	return this
}

assigner.recursive = function (recursive) {
	this.options.recursive = recursive
	return this
}

assigner.attributes = function (list) {
	this.options.attributes = list
	return this
}

assigner.excluded = function (list) {
	this.options.excluded = list
	return this
}

assigner.primitives = function (list) {
	this.options.primitives = list
	return this
}

assigner.blueprinting = function ( blueprinting ) {
	this.options.blueprinting = blueprinting
	return this
}

assigner.forceful = function ( forceful ) {
	this.options.forceful = forceful
	return this
}

assigner.typed = function ( typed ) {
	this.options.typed = typed
	return this
}

assigner.modes = function ( options ) {
	options = options || {}
	this.validvalues( options.validvalues )
	this.respect( options.respect )
	this.recursive( options.recursive )
	this.blueprinting( options.blueprinting )
	this.forceful( options.forceful )
	this.typed( options.typed )
}

assigner.copyObject = function ( source, object ) {
	if (!source) return object

	object = object || { }

	let props = this.options.blueprinting ? Object.keys(object) : Object.keys(source)

	let index = -1,
		length = props.length

	while (++index < length) {
		let key = props[index]

		if (
			key === '__proto__' ||
			key === 'prototype' ||
			key === 'constructor'
		) continue

		if ( this.options.validvalues && (source[key] === null || source[key] === undefined) )
			continue
		if ( this.options.attributes && this.options.attributes.indexOf(key) === -1 )
			continue
		if ( this.options.excluded && this.options.excluded.indexOf(key) !== -1 )
			continue

		let ref = this.options.forceful ? source[key] : object[key]
		if ( this.options.primitives && this.options.primitives.indexOf(key) !== -1 )
			object[key] = this.cloneObject( source[key] )
		else if (_.isPlainObject( ref ) && this.options.recursive ) {
			if (this.options.forceful && !object[key]) object[key] = {}
			this.copyObject( source[key], object[key] )
		} else {
			if ( !this.options.respect || object[key] === null || object[key] === undefined )
				object[key] = this.cloneObject( source[key] )
			else if ( this.options.logger )
				this.options.logger.warn( 'The following attribute is defined and respected: ' + key )
		}
	}
	return object
}

assigner.cloneObject = function ( source ) {
	if (!source) return source

	if (_.isPlainObject( source ) ) {
		let object = { }
		let index = -1, props = Object.keys( source ), length = props.length

		while (++index < length) {
			let key = props[index]

			if (
				key === '__proto__' ||
				key === 'prototype' ||
				key === 'constructor'
			) continue

			if ( this.options.excluded && this.options.excluded.indexOf(key) !== -1 )
				continue
			if (this.options.typed && source[key]._type )
				object[ key ] = source.value || source.defaultValue || source.defaultvalue
			else
				object[ key ] = this.cloneObject( source[key] )
		}

		return object
	}
	else if (_.isArray( source ) ) {
		let array = []
		for (let element of source)
			array.push( this.cloneObject( element ) )
		return array
	}

	return source
}

assigner.mask = function (source, mask) {
	if (!source || !mask) return source

	if (_.isPlainObject( source ) ) {
		let object = { }
		let index = -1, props = Object.keys( mask ), length = props.length

		while (++index < length) {
			let key = props[index]
			if ( !mask[key] ) continue
			object[ key ] = _.isPlainObject( mask[key] ) ? this.mask( source[key], mask[key] ) : source[key]
		}

		return object
	}
	else if (_.isArray( source ) ) {
		let array = []
		for (let element of source)
			array.push( this.mask( element, mask ) )
		return array
	}

	return source
}

assigner.purify = function (source, mask) {
	if (!source || !mask) return source

	if (_.isPlainObject( source ) ) {
		let object = { }
		let index = -1, props = Object.keys( source ), length = props.length

		while (++index < length) {
			let key = props[index]
			if ( !mask[key] ) object[ key ] = source[key]
			else if ( _.isPlainObject(mask[key]) ) object[ key ] = this.purify( source[key], mask[key] )
		}

		return object
	}
	else if (_.isArray( source ) ) {
		let array = []
		for (let element of source)
			array.push( this.purify( element, mask ) )
		return array
	}

	return source
}


assigner.pick = function (object, properties) {
	let obj = { }
	if ( !Array.isArray( arguments[1] ) )
		properties = Array.prototype.slice.call( arguments, 1, arguments.length )
	for (let property of properties)
		obj[ property ] = object[property]
	return obj
}

assigner.assign = function (target = {}, ...sources) {
	for ( let element of sources ) {
		if ( !element ) continue
		this.copyObject( element, target )
	}
	return target
}

module.exports = Assigner
