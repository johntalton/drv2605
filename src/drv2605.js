import { CommonBuilder, DeviceBuilder } from './builder.js'
import { DEFINITION } from './definition.js'

export class DRV2605 {
	constructor(bus) {
		const common = CommonBuilder.from(DEFINITION, {
			async setWaveformSequencer(_bus, sequence, options) {
				switch(sequence) {
				case 1: return this.setWaveformSequencer1(options)
				case 2: return this.setWaveformSequencer2(options)
				case 3: return this.setWaveformSequencer3(options)
				case 4: return this.setWaveformSequencer4(options)
				case 5: return this.setWaveformSequencer5(options)
				case 6: return this.setWaveformSequencer6(options)
				case 7: return this.setWaveformSequencer7(options)
				case 8: return this.setWaveformSequencer8(options)
				default:
					throw new Error(`sequence number invalid ${sequence}`)
				}
			}
		})

		return DeviceBuilder.from(common, bus)
	}
}

