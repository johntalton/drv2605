export const DEVICE_ID_MAP = {
	3: 'DRV2605 (contains licensed ROM library, does not contain RAM)',
	4: 'DRV2604 (contains RAM, does not contain licensed ROM library)',
	6: 'DRV2604L (low-voltage version of the DRV2604 device)',
	7: 'DRV2605L (low-voltage version of the DRV2605 device)'
}

export const WAVEFORM_SEQUENCER_END_ID = 0
export const WAVEFORM_SEQUENCER_MAX_ITEMS = 8

export const MODE = {
	INTERNAL_TRIGGER: 0,
	EXTERNAL_TRIGGER_EDGE: 1,
	EXTERNAL_TRIGGER_LEVEL: 2,
	PWM: 3,
	AUDIO_TO_VIBE: 4,
	REAL_TIME: 5,
	DIAGNOSTICS: 6,
	AUTO_CALIBRATION: 7
}

export const PLAYBACK_INTERVAL = {
	MS_5: 0,
	MS_1: 1
}


export const WAIT_TIME_MULTIPLIER_MS = 10

export const DEVICE_MODE = {
	ERM: 0,
	LRA: 1
}

export const BACK_EMP_MULTIPLIER_VOLTAGE = 1.22
export const A2V_BASE_LEVEL_VOLTAGE = 1.8
export const OPEN_LOOP_PERIOD_MULTIPLIER_US = 98.46
export const VBAT_MULTIPLIER_V = 5.6
export const LRA_PERIOD_MULTIPLIER_US = 98.46
export const PLAYBACK_INTERVAL_MULTIPLIERS = {
	[PLAYBACK_INTERVAL.MS_5]: 5,
	[PLAYBACK_INTERVAL.MS_1]: 1
}
export const BEMP_GAIN_MULTIPLIERS_EMF = {
	0: 0.255,
	1: 0.7875,
	2: 1.365,
	3: 3.0
}
export const BEMP_GAIN_MULTIPLIERS_LRA = {
	0: 3.75,
	1: 7.5,
	2: 15,
	3: 22.5
}
export const BEMF_GAIN_MULTIPLIERS_MODE = {
	[DEVICE_MODE.ERM]: BEMP_GAIN_MULTIPLIERS_EMF,
	[DEVICE_MODE.LRA]: BEMP_GAIN_MULTIPLIERS_LRA
}

// export const BLANKING_TIME_MULTIPLIERS_EMF = {}

// export const IDISS_TIME__MULTIPLIERS_LAR = {}


export const LRA_MODE_DRIVE_TIME_FACTOR_MS = 0.1
export const ERM_MODE_DRIVE_TIME_FACTOR_MS = 0.2
export const LRA_MODE_DRIVE_TIME_OFFSET_MS = 0.5
export const ERM_MODE_DRIVE_TIME_OFFSET_MS = 1


export const DEFINITION = {
	name: 'drv2605',
	registers: {
		'Status': {
			address: 0x00,
			default: 0xE0,
			readonly: true,
			fields: {
				'DEVICE_ID': { offset: 7, length: 3 },
				'DIAG_RESULTS': { type: 'boolean', offset: 3 },
				// 'FB_STS': { type: 'boolean', offset: 2 }, // DRV2605 only
				'OVER_TEMP': { type: 'boolean', offset: 1 },
				'OC_DETECT': { type: 'boolean', offset: 0 }
			}
		},
		'Mode': {
			address: 0x01,
			default: 0x40,
			fields: {
				'DEV_RESET': { type: 'boolean', offset: 7 },
				'STANDBY': { type: 'boolean', offset: 6 },
				'MODE': {
					offset: 2,
					length: 3,
					type: 'enum',
					enumerations: [
						'Internal Trigger',
						'External Trigger (edge mode)',
						'External Trigger (level mode)',
						'PWM input and analog input',
						'Audio-to-vibe',
						'Real-time playback (RTP mode)',
						'Diagnostics',
						'Auto calibration'
					]
				}
			}
		},
		'Real Time Playback Input': {
			address: 0x02,
			default: 0x00,
			fields: {
				'RTP_INPUT': {}
			}
		},
		'Library Selection': {
			address: 0x03,
			default: 0x01,
			fields: {
				'HI_Z': { type: 'boolean', offset: 4 },
				'LIBRARY_SEL': {
					offset: 2,
					length: 3,
					type: 'enum',
					enumerations: [
						'Empty',
						'TS2200 Library A',
						'TS2200 Library B',
						'TS2200 Library C',
						'TS2200 Library D',
						'TS2200 Library E',
						'LRA Library',
						'TS2200 Library F'
					]
				}
			}
		},
		'Waveform Sequencer 1': {
			address: 0x04,
			default: 0x01,
			fields: {
				'WAIT': { type: 'boolean', offset: 7 },
				'WAV_FRM_SEQ': { offset: 6, length: 7 }
			}
		},
		'Waveform Sequencer 2': {
			address: 0x05,
			default: 0x00,
			fields: {
				'WAIT': { type: 'boolean', offset: 7 },
				'WAV_FRM_SEQ': { offset: 6, length: 7 }
			}
		},
		'Waveform Sequencer 3': {
			address: 0x06,
			default: 0x00,
			fields: {
				'WAIT': { type: 'boolean', offset: 7 },
				'WAV_FRM_SEQ': { offset: 6, length: 7 }
			}
		},
		'Waveform Sequencer 4': {
			address: 0x07,
			default: 0x00,
			fields: {
				'WAIT': { type: 'boolean', offset: 7 },
				'WAV_FRM_SEQ': { offset: 6, length: 7 }
			}
		},
		'Waveform Sequencer 5': {
			address: 0x08,
			default: 0x00,
			fields: {
				'WAIT': { type: 'boolean', offset: 7 },
				'WAV_FRM_SEQ': { offset: 6, length: 7 }
			}
		},
		'Waveform Sequencer 6': {
			address: 0x09,
			default: 0x00,
			fields: {
				'WAIT': { type: 'boolean', offset: 7 },
				'WAV_FRM_SEQ': { offset: 6, length: 7 }
			}
		},
		'Waveform Sequencer 7': {
			address: 0x0A,
			default: 0x00,
			fields: {
				'WAIT': { type: 'boolean', offset: 7 },
				'WAV_FRM_SEQ': { offset: 6, length: 7 }
			}
		},
		'Waveform Sequencer 8': {
			address: 0x0B,
			default: 0x00,
			fields: {
				'WAIT': { type: 'boolean', offset: 7 },
				'WAV_FRM_SEQ': { offset: 6, length: 7 }
			}
		},
		'Go': {
			address: 0x0C,
			default: 0x00,
			fields: {
				'GO': { type: 'boolean', offset: 0 }
			}
		},
		'Overdrive Time Offset': {
			address: 0x0D,
			default: 0x00,
			fields: {
				'ODT': { }
			}
		},
		'Sustain Time Offset Positive': {
			address: 0x0E,
			default: 0x00,
			fields: {
				'SPT': {}
			}
		},
		'Sustain Time Offset Negative': {
			address: 0x0F,
			default: 0x00,
			fields: {
				'SNT': {}
			}
		},
		'Brake Time Offset': {
			address: 0x10,
			default: 0x00,
			fields: {
				'BRT': {}
			}
		},
		'Audio To Vibe Control': {
			address: 0x11,
			default: 0x00,
			fields: {
				'ATH_PEAK_TIME': {
					offset: 3,
					length: 2,
					units: 'ms',
					type: 'enum',
					enumerations: [
						'10',
						'20',
						'30',
						'40'
					]
				},
				'ATH_FILTER': {
					offset: 1,
					length: 2,
					units: 'Hz',
					type: 'enum',
					enumerations: [
						'100',
						'125',
						'150',
						'200'
					]
				}
			}
		},
		'Audio To Vibe Minimum Input Level': {
			address: 0x12,
			default: 0x19,
			fields: {
				'ATH_MIN_INPUT': {}
			}
		},
		'Audio To Vibe Maximum Input Level': {
			address: 0x13,
			default: 0xFF,
			fields: {
				'ATH_MAX_INPUT': {}
			}
		},
		'Audio To Vibe Minimum Output Drive': {
			address: 0x14,
			default: 0x19,
			fields: {
				'ATH_MIN_DRIVE': {}
			}
		},
		'Audio To Vibe Maximum Output Drive': {
			address: 0x15,
			default: 0xFF,
			fields: {
				'ATH_MAX_DRIVE': {}
			}
		},
		'Rated Voltage': {
			address: 0x16,
			default: 0x3E,
			fields: {
				'RATED_VOLTAGE': {}
			}
		},
		'Overdrive Clamp Voltage': {
			address: 0x17,
			default: 0x8C,
			fields: {
				'OD_CLAMP': {}
			}
		},
		'Auto-Calibration Compensation Result': {
			address: 0x18,
			default: 0x0C,
			fields: {
				'A_CAL_COMP': {}
			}
		},
		'Auto-Calibration Back-EMF Result': {
			address: 0x19,
			default: 0x6C,
			fields: {
				'A_CAL_BEMF': {}
			}
		},
		'Feedback Control': {
			address: 0x1A,
			default: 0x36,
			fields: {
				'N_ERM_LRA': {
					type: 'enum',
					offset: 7,
					length: 1,
					enumerations: [
						'ERM Mode',
						'LRA Mode'
					]
				},
				'FB_BRAKE_FACTOR': {
					type: 'enum',
					offset: 6,
					length: 3,
					enumerations: [
						'1x',
						'2x',
						'3x',
						'4x',
						'6x',
						'8x',
						'16x',
						'Braking disabled'
					]
				},
				'LOOP_GAIN': {
					type: 'enum',
					offset: 3,
					length: 2,
					enumerations: [
						'Low',
						'Medium (default)',
						'High',
						'Very High'
					]
				},
				'BEMF_GAIN': {
					type: 'enum',
					offset: 1,
					length: 2,
					enumerations: [
						// ERM Mode
						// 0: 0.255x
						// 1: 0.7875x
						// 2: 1.365x (default)
						// 3: 3.0x
						// LRA Mode
						// 0: 3.75x
						// 1: 7.5x
						// 2: 15x (default)
						// 3: 22.5x
					]
				}
			}
		},
		'Control 1': {
			address: 0x1B,
			default: 0x93,
			fields: {
				'STARTUP_BOOST': { type: 'boolean', offset: 7 },
				'AC_COUPLE': { type: 'boolean', offset: 5 },
				'DRIVE_TIME': { offset: 4, length: 5 }
			}
		},
		'Control 2': {
			address: 0x1C,
			default: 0xF5,
			fields: {
				'BIDIR_INPUT': {
					type: 'enum',
					offset: 7,
					length: 1,
					enumerations: [
						'Unidirectional input mode',
						'Bidirectional input mode'
					]
				},
				'BRAKE_STABILIZER': { type: 'boolean', offset: 6 },
				'SAMPLE_TIME': {
					type: 'enum',
					offset: 5,
					length: 2,
					enumerations: [
						'150 µs',
						'200 µs',
						'250 µs',
						'300 µs'
					]
				},
				'BLANKING_TIME': {
					type: 'enum',
					offset: 3,
					length: 2,
					enumerations: [
						// N_ERM_LRA = 0 (ERM mode)
						// 0: 45 µs
						// 1: 75 µs
						// 2: 150 µs
						// 3: 225 µs
						// N_ERM_LRA = 1(LRA mode)
						// 0: 15 µs
						// 1: 25 µs
						// 2: 50 µs
						// 3: 75 µs
						// 4: 90 µs
						// 5: 105 µs
						// 6: 120 µs
						// 7: 135 µs
						// 8: 150 µs
						// 9: 165 µs
						// 10: 180 µs
						// 11: 195 µs
						// 12: 210 µs
						// 13: 235 µs
						// 14: 260 µs
						// 15: 285 µs
					]
				},
				'IDISS_TIME': {
					offset: 1,
					length: 2,
					enumerations: [
						// N_ERM_LRA = 0 (ERM mode)
						// 0: 45 µs
						// 1: 75 µs
						// 2: 150 µs
						// 3: 225 µs
						// N_ERM_LRA = 1(LRA mode)
						// 0: 15 µs
						// 1: 25 µs
						// 2: 50 µs
						// 3: 75 µs
						// 4: 90 µs
						// 5: 105 µs
						// 6: 120 µs
						// 7: 135 µs
						// 8: 150 µs
						// 9: 165 µs
						// 10: 180 µs
						// 11: 195 µs
						// 12: 210 µs
						// 13: 235 µs
						// 14: 260 µs
						// 15: 285 µs
					]
				}
			}
		},
		'Control 3': {
			address: 0x1D,
			default: 0xA0,
			fields: {
				'NG_THRESH': {
					type: 'enum',
					offset: 7,
					length: 2,
					enumerations: [
						'Disabled', '2%', '4%', '8%'
					]
				},
				'ERM_OPEN_LOOP': {
					type: 'enum',
					offset: 5,
					length: 1,
					enumerations: [ 'Closed Loop', 'Open Loop' ]
				},
				'SUPPLY_COMP_DIS': {
					type: 'enum',
					offset: 4,
					length: 1,
					enumeration: [ 'enabled', 'disabled' ]
				},
				'DATA_FORMAT_RTP': {
					type: 'enum',
					offset: 3, length: 1,
					enumerations: [ 'signed', 'unsigned' ]
				},
				'LRA_DRIVE_MODE': {
					type: 'enum',
					offset: 2,
					length: 1,
					enumerations: [ 'Once Per Cycle', 'Twice Per Cycle' ]
				},
				'N_PWM_ANALOG': {
					type: 'enum',
					offset: 1,
					length: 1,
					enumerations: [ 'PWM Input', 'Analog Input' ]
				},
				'LRA_OPEN_LOOP': {
					type: 'enum',
					offset: 0,
					length: 1,
					enumerations: [ 'Auto-resonance mode', 'LRA open-loop mode' ]
				}
			}
		},
		'Control 4': {
			address: 0x1E,
			default: 0x20,
			fields: {
				'ZC_DET_TIME': {	// DRV2605L only
					type: 'enum',
					offset: 7,
					length: 2,
					enumerations: [
						'100 µs',
						'200 µs',
						'300 µs',
						'390 µs'
					]
				},
				'AUTO_CAL_TIME': {
					type: 'enum',
					offset: 5,
					length: 2,
					enumerations: [
						'150 to 350',
						'250 to 450',
						'500 to 700',
						'1000 to 1200'
					]
				},
				'OTP_STATUS': {
					type: 'enum',
					offset: 2,
					length: 1,
					readonly: true,
					enumerations: [
						'OTP Memory has not been programmed',
						'OTP Memory has been programmed'
					]
				},
				'OTP_PROGRAM': {
					readonly: true, // todo support restricted
					type: 'boolean',
					offset: 0
				}


			}
		},
		'Control 5': { // DRV2605L only
			address: 0x1F,
			default: 0x80,
			fields: {
				'AUTO_OL_CNT': {
					type: 'enum',
					offset: 7,
					length: 2,
					enumerations: [
						'3 attempts',
						'4 attempts',
						'5 attempts',
						'6 attempts'
					]
				},
				'LRA_AUTO_OPEN_LOOP': {
					type: 'enum',
					offset: 5,
					length: 1,
					enumerations: [
						'Never transitions to open loop',
						'Automatically transitions to open loop'
					]
				},
				'PLAYBACK_INTERVAL': {
					type: 'enum',
					offset: 4,
					length: 1,
					enumerations: [
						'5 ms',
						'1 ms'
					]
				},
				'BLANKING_TIME': { offset: 3, length: 2 },
				'IDISS_TIME': { offset: 1, length: 2 }
			}
		},
		'LRA Open Loop Period': { // DRV2605L only
			address: 0x20,
			default: 0x33,
			fields: {
				'OL_LRA_PERIOD': { offset: 6, length: 7 }
			}
		},
		'V(BAT) Voltage Monitor': {
			address: 0x21,
			default: 0x00,
			fields: {
				'VBAT': { }
			}
		},
		'LRA Resonance Period': {
			address: 0x22,
			default: 0x00,
			fields: {
				'LRA_PERIOD': { }
			}
		},
	},
	bulk: {
		'Controls': {
			address: 0x1A,
			length: 6,
			unify: true
		},
		'Waveform Sequences': {
			address: 0x04,
			length: 8
		}
	}
}
