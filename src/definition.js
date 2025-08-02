export const DEVICE_ID_MAP = {
	3: 'DRV2605 (contains licensed ROM library, does not contain RAM)',
	4: 'DRV2604 (contains RAM, does not contain licensed ROM library)',
	6: 'DRV2604L (low-voltage version of the DRV2604 device)',
	7: 'DRV2605L (low-voltage version of the DRV2605 device)'
}



export const DEFINITION = {
	name: 'drv2605',
	registers: {
		'Status': {
			address: 0x00,
			default: 0xE0,
			readonly: true,
			fields: {
				'DEVICE_ID': { offset: 7, length: 3 },
				'DIAG_RESULTS': { type: 'boolean', offset: 3},
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
		'Break Time Offset': {
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
				'BLANKING_TIME': { offset: 3, length: 2 },
				'IDISS_TIME': { offset: 1, length: 2 }
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
					type: 'boolean',
					offset: 4
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
				'OTP_PROGRAM': { type: 'boolean', offset: 0 }


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
	}
}
