import { BitSmush } from '@johntalton/bitsmush'

export const DEFAULT_FILED_TYPE = 'int'
export const DEFAULT_FIELD_OFFSET = 7
export const DEFAULT_FIELD_LENGTH = 8

export const NAME_SANITIZATION_REGEX = /[ \-\(\)]/g

export const SANITIZED_NAME_PREFIX_SET = 'set'
export const SANITIZED_NAME_PREFIX_GET = 'get'

export const DECODE_NAME_PREFIX = 'decode'
export const IDENTITY_DECODER = deviceObj => deviceObj

export function* range(start, end, step = 1) {
	yield start
	if (start >= end) return
	yield* range(start + step, end, step)
}

export class DeviceBuilder {
	/**
	 * Return from constructor of Device class to automatically inject `bus` into method calls to `common`
	 * ```
	 * class MyDevice { constructor(bus) { return DeviceBuilder.from(CommonBuilder.from(DEFINITION, {}), bus)} }
	 * ```
	 */
	static from(common, bus) {
		return new Proxy(common, {
			get(target, prop, receiver) {
				const commonTarget = Reflect.get(target, prop, receiver)
				if(commonTarget === undefined) { throw new TypeError(`${String(prop)} is not a function`)}
				return new Proxy(commonTarget, {
					apply(target, thisArg, argArray) {
						return Reflect.apply(target, thisArg, [ bus, ...argArray ])
					}
				})
			}
		})
	}
}

export class CommonBuilder {
	static sanitizedGetSetNames(name) {
		const funcName = name.replaceAll(NAME_SANITIZATION_REGEX, '')
		return {
			funcName,
			getFuncName: SANITIZED_NAME_PREFIX_GET + funcName,
			setFuncName: SANITIZED_NAME_PREFIX_SET + funcName
		}
	}

	static fieldDeserialize(buffer, fieldDef) {
	const u8 = ArrayBuffer.isView(buffer) ?
		new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
		new Uint8Array(buffer)

	const data = u8[0]
	const type = (fieldDef?.type ?? DEFAULT_FILED_TYPE).toLowerCase()
	const offset = fieldDef?.offset ?? DEFAULT_FIELD_OFFSET
	const length = fieldDef?.length ?? DEFAULT_FIELD_LENGTH

	if(type === 'boolean') {
		const bit = BitSmush.extractBits(data, offset, 1)
		// todo support active low
		return bit === 1
	}

	if(type === 'int') {
		const bits = BitSmush.extractBits(data, offset, length)
		return bits
	}

	if(type === 'enum') {
		const bits = BitSmush.extractBits(data, offset, length)
		return bits
	}

	console.warn('unknown type', type)

	return data
}

static fieldSerialize(value, fieldDef) {
	const type = (fieldDef?.type ?? DEFAULT_FILED_TYPE).toLowerCase()
	const offset = fieldDef?.offset ?? DEFAULT_FIELD_OFFSET
	const length = fieldDef?.length ?? DEFAULT_FIELD_LENGTH

	if (type === 'boolean') {
		return BitSmush.smushBits([ [ offset, 1 ] ], [ value ? 1 : 0 ])
	}

	return BitSmush.smushBits([ [ offset, length ] ], [ value ])
}

	static makeDeserializer(regDef) {
		const entries = Object.entries(regDef.fields)

		if(entries.length === 1) {
			const [ _key, fieldDef ] = entries[0]
			return buffer => CommonBuilder.fieldDeserialize(buffer, fieldDef)
		}

		return buffer => {
			return entries
				.map(([key, fieldDef]) => {
					return {
						[key]: CommonBuilder.fieldDeserialize(buffer, fieldDef)
					}
				})
				.reduce((acc, cur) => {
					return { ...acc, ...cur }
				}, {})
		}
	}

	static makeSerializer(regDef) {
		const entries = Object.entries(regDef.fields)

		if(entries.length === 1) {
			const [ key, fieldDef ] = entries[0]

			return (obj, ...options) => {
				if(fieldDef.readonly === true) { throw new Error(`field readonly ${key}`) }
				const data = CommonBuilder.fieldSerialize(obj, fieldDef)
				return new Uint8Array([  data ])
			}
		}

		return (obj, ...options) => {
			const data = entries.map(([ key, fieldDef ]) => {
					const value = obj[key]
					if(value === undefined) { return 0 }
					if(fieldDef.readonly === true) { throw new Error(`field readonly ${key}`) }
					return CommonBuilder.fieldSerialize(value, fieldDef)
				})
				.reduce((acc, value) => acc |= value, 0)

			return new Uint8Array([ data ])
		}
	}

	static makeBulkDeserializer(definition, bulkDef,) {
		const deserializers = [ ...range(bulkDef.address, bulkDef.address + bulkDef.length - 1) ]
			.map(register => {
				const match = Object.entries(definition.registers).find(([ _, regDef ]) => regDef.address === register)
				if(match === undefined) { throw new Error('unknown register reference') }
				return match
			})
			.map(([ regName, regDef ]) => ([ regName.replaceAll(NAME_SANITIZATION_REGEX, ''), regDef ]))
			.map(([ regName, regDef ]) => ({ regName, deserializer: CommonBuilder.makeDeserializer(regDef) }))


		//
		return (buffer) => {
			const u8 = ArrayBuffer.isView(buffer) ?
				new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
				new Uint8Array(buffer, buffer.byteOffset, buffer.byteLength)

			const results =  [ ...u8 ].map((value, index) => {
				const { regName, deserializer } = deserializers[index]
				return { regName, result: deserializer(new Uint8Array([ value ])) }
			})

			// unify will add all fields to a single object
			// otherwise a unnamed ordered array of results will be returned
			if(bulkDef.unify ?? false) {
				return results.reduce((acc, value) => {
					const { regName, result } = value
					acc[regName] = result
					return acc
				}, {})
			}

			return results.map(({ _regName, result }) => result)
		}
	}

	static makeBulkSerializer(definition, bulkDef) {
		return (obj, ...options) => {}
	}

	static makeEncoder() {
		return userObj => userObj
	}

	static makeDecoder(converter, funcName) {
		const decodeFuncName = DECODE_NAME_PREFIX + funcName
		return converter[decodeFuncName] ?? IDENTITY_DECODER
	}

	static from(definition, converter, root = {}) {
		Object.entries(definition.registers)
			.forEach(([ name, regDef ]) => {
				const { getFuncName, setFuncName, funcName } = CommonBuilder.sanitizedGetSetNames(name)

				const deserializer = CommonBuilder.makeDeserializer(regDef)
				const serializer = CommonBuilder.makeSerializer(regDef)

				const encode = CommonBuilder.makeEncoder()
				const decode = CommonBuilder.makeDecoder(converter, funcName)

				root[getFuncName] = async (bus) => decode(deserializer(await bus.readI2cBlock(regDef.address, 1)))
				if(regDef.readonly !== true) {
					root[setFuncName] = async (bus, ...args) => bus.writeI2cBlock(regDef.address, serializer(encode(...args)))
				}
			})


		Object.entries(definition.bulk)
			.forEach(([ name, bulkDef]) => {
				const { getFuncName, setFuncName } = CommonBuilder.sanitizedGetSetNames(name)

				const deserializer = CommonBuilder.makeBulkDeserializer(definition, bulkDef)
				const serializer = CommonBuilder.makeBulkSerializer(definition, bulkDef)

				const encode = (userObj) => {} // todo
				const decode = IDENTITY_DECODER // todo

				root[getFuncName] = async (bus) => decode(deserializer(await bus.readI2cBlock(bulkDef.address, bulkDef.length)))
				if(bulkDef.readonly !== true) {
					root[setFuncName] = async (bus, ...args) => bus.writeI2cBlock(bulkDef.address, serializer(encode(...args)))
				}
			})

			return root
	}
}


