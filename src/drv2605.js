import { CommonBuilder, DeviceBuilder } from './builder.js'
import {
	A2V_BASE_LEVEL_VOLTAGE,
	BACK_EMP_MULTIPLIER_VOLTAGE,
	BEMF_GAIN_MULTIPLIERS_MODE,
	DEFINITION,
	LRA_PERIOD_MULTIPLIER_US,
	OPEN_LOOP_PERIOD_MULTIPLIER_US,
	PLAYBACK_INTERVAL_MULTIPLIERS,
	VBAT_MULTIPLIER_V,
	WAIT_TIME_MULTIPLIER_MS
} from './definition.js'

export class UnitConverter {
	static decodeOverdriveTimeOffset(raw, playbackInterval) {
		return raw * PLAYBACK_INTERVAL_MULTIPLIERS[playbackInterval]
	}

	static decodeSustainTimeOffsetPositive(raw, playbackInterval) {
		return raw * PLAYBACK_INTERVAL_MULTIPLIERS[playbackInterval]
	}

	static decodeSustainTimeOffsetNegative(raw, playbackInterval) {
		return raw * PLAYBACK_INTERVAL_MULTIPLIERS[playbackInterval]
	}

	static decodeBrakeTimeOffset(raw, playbackInterval) {
		return raw * PLAYBACK_INTERVAL_MULTIPLIERS[playbackInterval]
	}

	static decodeAudioToVibeMinimumInputLevel(deviceObj) {
		return deviceObj * A2V_BASE_LEVEL_VOLTAGE / 255
	}

	static decodeAudioToVibeMaximumInputLevel(deviceObj) {
		return deviceObj * A2V_BASE_LEVEL_VOLTAGE / 255
	}

	static decodeAudioToVibeMinimumOutputDrive(deviceObj) {
		return deviceObj / 255 * 100
	}

	static decodeAudioToVibeMaximumOutputDrive(deviceObj) {
		return deviceObj / 255 * 100
	}

	static decodeRatedVoltage(raw, deviceMode, sampleTime) {
		// ERM  = 21.18 * Math.pow(10, -3) * raw

		// LRA = (20.58 * 10 * raw) / Math.sqrt(1 + (4 * sampleTime + 200 * Math.pow(10, -6)) * F_lra)

		return undefined
	}

	static decodeOverdriveClampVoltage(raw, driveTime, idissTime, blankingTime) {
		return undefined
	}

	static decodeAutoCalibrationCompensationResult(raw) {
		return 1 + raw / 255
	}

	static decodeAutoCalibrationBackEMFResult(raw, deviceMode, gain) {
		const gainValue = BEMF_GAIN_MULTIPLIERS_MODE[deviceMode][gain]

		return (raw / 255) * BACK_EMP_MULTIPLIER_VOLTAGE / gainValue
	}


	static decodeLRAOpenLoopPeriod(deviceObj) {
		return deviceObj * OPEN_LOOP_PERIOD_MULTIPLIER_US
	}

	static decodeVBATVoltageMonitor(deviceObj) {
		return deviceObj * VBAT_MULTIPLIER_V / 255
	}

	static decodeLRAResonancePeriod(deviceObj) {
		return deviceObj * LRA_PERIOD_MULTIPLIER_US
	}
}

export class Converter {
	static decodeWaveformSequencer(deviceObj) {
		const { WAIT, WAV_FRM_SEQ } = deviceObj

		return {
			wait: WAIT,
			waitTime: (WAV_FRM_SEQ * WAIT_TIME_MULTIPLIER_MS),
			effect: WAV_FRM_SEQ
		}
	}

	static decodeWaveformSequencer1(deviceObj) { return Converter.decodeWaveformSequencer(deviceObj) }
	static decodeWaveformSequencer2(deviceObj) { return Converter.decodeWaveformSequencer(deviceObj) }
	static decodeWaveformSequencer3(deviceObj) { return Converter.decodeWaveformSequencer(deviceObj) }
	static decodeWaveformSequencer4(deviceObj) { return Converter.decodeWaveformSequencer(deviceObj) }
	static decodeWaveformSequencer5(deviceObj) { return Converter.decodeWaveformSequencer(deviceObj) }
	static decodeWaveformSequencer6(deviceObj) { return Converter.decodeWaveformSequencer(deviceObj) }
	static decodeWaveformSequencer7(deviceObj) { return Converter.decodeWaveformSequencer(deviceObj) }
	static decodeWaveformSequencer8(deviceObj) { return Converter.decodeWaveformSequencer(deviceObj) }

	// static decodeWaveformSequences(deviceObj) { }
}

export class DRV2605 {
	constructor(bus) {
		const common = CommonBuilder.from(DEFINITION, Converter, {
			async reset() { return this.setMode({ DEV_RESET: true }) },
			async go() { this.setGo(true) },
			async stop() { this.setGo(false) },

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