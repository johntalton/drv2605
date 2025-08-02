# DRV2605

![CI](https://github.com/johntalton/drv2605/workflows/CI/badge.svg)
![GitHub](https://img.shields.io/github/license/johntalton/drv2605)

 Haptic Driver for ERM and LRA based on the [DRV2605](https://www.adafruit.com/product/2305) supporting full range of configuration options.


## Example
```javascript
const bus = /* underlying I2CBus implementation */
const DEFAULT_DRV2605L_ADDRESS = 0x5A
const abus = I2CAddressedBus(bus, DEFAULT_DRV2605L_ADDRESS)
const device = new DRV2605(abus)

// while the 26xxx series chips are similar this has only been tested with the 2605L
const DRV2605L_DEVICE_ID = 7
const { DEVICE_ID } = await device.getStatus()
if(DEVICE_ID !== DRV2605L_DEVICE_ID) { throw new Error('unknown device') }

// Set the Mode to internal trigger (aka Go) and take out of standby
await .setMode({
  DEV_RESET: false,
  STANDBY: false,
  MODE: 0
})

// Switch into ERM Mode (Eccentric Rotating Mass) width default settings
await device.setFeedbackControl({
  N_ERM_LRA: 0,       // ERM Mode,
  FB_BRAKE_FACTOR: 3, // 4x
  LOOP_GAIN: 1,       // Medium
  BEMF_GAIN: 2
})

// switch into open-loop
const control3 = await device.getControl3()
await device.setControl3({
  ...control3,
  ERM_OPEN_LOOP: 1 // open loop
})

//
// setup a Sequence of step to create a nice little buzz
//
await device.setWaveformSequencer1({
  WAV_FRM_SEQ: 88 // Transition Ramp Up Long Sharp 1 – 0 to 100%
})
await device.setWaveformSequencer2({
  WAV_FRM_SEQ: 52 // Pulsing Strong 1 – 100%
})
await device.setWaveformSequencer3({
  WAV_FRM_SEQ: 0 // End
})

//
// trigger a single run of the above defined sequence
//
await device.setGo({ GO: true })

```


 ### Note on implementation architecture
aka: note to self (or other developers interest in how all of this works - or doesn't)

 This driver (unlike other found here) use a Definition file base on the Register map provided in the datasheet.  While this 'simplifies' the implementation, it removes some of the ergonomics of the API.

 Specifically the setting of enumeration properties, and limits the ability to have dynamic enumeration base on configuration.

 It thus also has limited typing and documentation by default.

 This is viewed as a working experiment on the architecture of these drivers as we way to unify some of the more boilerplate code, and may likely change back to a more bespoke/handwritten version in the future.

 It however is tested and works generally well for its intended use cases.

