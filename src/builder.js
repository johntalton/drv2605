import { BitSmush } from '@johntalton/bitsmush'

export const DEFAULT_FILED_TYPE = 'int'
export const DEFAULT_FIELD_OFFSET = 7
export const DEFAULT_FIELD_LENGTH = 8

export function* range(start, end, step = 1) {
	yield start
	if (start >= end) return
	yield* range(start + step, end, step)
}

function fieldDeserialize(buffer, fieldDef) {
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

function fieldSerialize(value, fieldDef) {
	const type = (fieldDef?.type ?? DEFAULT_FILED_TYPE).toLowerCase()
	const offset = fieldDef?.offset ?? DEFAULT_FIELD_OFFSET
	const length = fieldDef?.length ?? DEFAULT_FIELD_LENGTH

	if (type === 'boolean') {
		return BitSmush.smushBits([ [ offset, 1 ] ], [ value ? 1 : 0 ])
	}

	return BitSmush.smushBits([ [ offset, length ] ], [ value ])
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
				return new Proxy(Reflect.get(target, prop, receiver), {
					apply(target, thisArg, argArray) {
						return Reflect.apply(target, thisArg, [ bus, ...argArray ])
					}
				})
			}
		})
	}
}

export class CommonBuilder {
	static makeDeserializer(regDef) {
		return buffer => {
			return Object.entries(regDef.fields)
				.map(([key, fieldDef]) => {
					return {
						[key]: fieldDeserialize(buffer, fieldDef)
					}
				})
				.reduce((acc, cur) => {
					return { ...acc, ...cur }
				}, {})
		}
	}

	static from(definition, root = {}) {
		const funcs = Object.entries(definition.registers)
			.map(([ name, regDef ]) => {
				const cleanFuncName = name.replaceAll(/[ \-\(\)]/g, '')
				const getFuncName = 'get' + cleanFuncName
				const setFuncName = 'set' + cleanFuncName

				const deserializer = CommonBuilder.makeDeserializer(regDef)

				const serializer = (obj, ...options) => {
					const data = Object.entries(regDef.fields)
						.map(([ key, fieldDef ]) => {
							return fieldSerialize(obj[key], fieldDef)
						})
						.reduce((acc, value) => acc |= value, 0)

					return new Uint8Array([ data ])
				}


				const getFunc = async (bus) => {
					const ab = await bus.readI2cBlock(regDef.address, 1)
					return deserializer(ab)
				}

				const setFunc = async (bus, ...args) => {
					const data = serializer(...args)
					const result = await bus.writeI2cBlock(regDef.address, data)
				}

				return [getFuncName, getFunc, setFuncName, setFunc]
			})

		const _root = funcs.reduce((acc, data) => {
			const [ getName, getFunc, setName, setFunc ] = data
			acc[getName] = getFunc
			acc[setName] = setFunc
			return acc
		}, root)

		const bulkFunc = Object.entries(definition.bulk)
			.map(([ name, bulkDef]) => {
				const cleanFuncName = name.replaceAll(/[ \-\(\)]/g, '')
				const getFuncName = 'get' + cleanFuncName
				const setFuncName = 'set' + cleanFuncName

				const deserializers = [ ...range(bulkDef.address, bulkDef.address + bulkDef.length - 1) ]
					.map(register => Object.entries(definition.registers).find(([ _, regDef ]) => regDef.address === register) ?? [ 'unknown', {} ])
					.map(([ regName, regDef ]) => ({ regName, deserializer: CommonBuilder.makeDeserializer(regDef) }))


				const serializer = (obj, ...options) => {}

				const deserializer = (buffer) => {
					const u8 = ArrayBuffer.isView(buffer) ?
						new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
						new Uint8Array(buffer, buffer.byteOffset, buffer.byteLength)

					return [ ...u8 ].map((value, index) => {
						const { regName, deserializer } = deserializers[index]
						return { regName, result: deserializer(new Uint8Array([ value ])) }
					})
					.map(({ regName, result }) => result)
					// .reduce((acc, value) => {
					// 	const { regName, result } = value
					// 	acc[regName] = result
					// 	return acc
					// }, {})
				}

				const getFunc = async (bus) => {
					const ab = await bus.readI2cBlock(bulkDef.address, bulkDef.length)
					return deserializer(ab)
				}

				const setFunc = async (bus, ...args) => {
					const data = serializer(...args)
					const result = await bus.writeI2cBlock(bulkDef.address, data)
				}

				return [getFuncName, getFunc, setFuncName, setFunc]
			})

		const obj = bulkFunc.reduce((acc, data) => {
			const [ getName, getFunc, setName, setFunc ] = data
			acc[getName] = getFunc
			acc[setName] = setFunc
			return acc
		}, _root)

		return obj
	}
}


