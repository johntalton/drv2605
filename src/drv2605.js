import { CommonBuilder } from './builder.js'
import { DEFINITION } from './definition.js'

export class DRV2605 {
	#bus
	#common = CommonBuilder.from(DEFINITION)

	constructor(bus) {
		this.#bus = bus
	}

	async getStatus() {
		const status = await this.#common.getStatus(this.#bus)
		return status
	}

	async getMode() {
		return this.#common.getMode(this.#bus)
	}

	async getLibrarySelection() { return this.#common.getLibrarySelection(this.#bus) }
}