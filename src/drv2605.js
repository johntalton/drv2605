import { CommonBuilder } from './builder.js'
import { DEFINITION } from './definition.js'

export class DRV2605 {
	constructor(bus) {
		const common = CommonBuilder.from(DEFINITION)

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

	// async getControls() {
	// 	const controls = await Promise.all([
	// 		this.getControl1(),
	// 		this.getControl2(),
	// 		this.getControl3(),
	// 		this.getControl4(),
	// 		this.getControl5(),
	// 	])

	// 	return controls.reduce((acc, value) => ({ ...acc, ...value }), {})
	// }

}