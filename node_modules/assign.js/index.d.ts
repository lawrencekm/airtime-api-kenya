declare module "assign.js" {
	interface ILogger {
		readonly warn: Function
	}

	type AssignerOptions = {
		recursive?: boolean
		validvalues?: boolean
		respect?: boolean
		attributes?: string[]
		excluded?: string[]
		primitives?: string[]
		blueprinting?: boolean
		forceful?: boolean
		typed?: boolean
	}

	class Assigner {
		constructor(options?: AssignerOptions)
		init(options?: AssignerOptions): Assigner
		logger(logger: ILogger): Assigner

		validvalues(validvalues: boolean): Assigner
		respect(respect: boolean): Assigner
		recursive(recursive: boolean): Assigner
		attributes(list: string[]): Assigner
		excluded(list: string[]): Assigner
		primitives(list: string[]): Assigner
		blueprinting(blueprinting: boolean): Assigner
		forceful(forceful: boolean): Assigner
		typed(typed: boolean): Assigner

		modes(options: AssignerOptions): Assigner
		copyObject(source: Record<string, any>, object: Record<string, any>)
		cloneObject(source: Record<string, any> | []): Record<string, any> | []
		mask(source: Record<string, any>, mask: Record<string, any>): Record<string, any>
		purify(source: Record<string, any>, mask: Record<string, any>): Record<string, any>
		pick(object: Record<string, any>, properties: Array<string>): Record<string, any>
		assign(target: Record<string, any>, ...sources: Array<Record<string, any>>): Record<string, any>
	}
	export = Assigner
}
