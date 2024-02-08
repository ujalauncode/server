const ffi = require('ffi-napi');
const ref = require('ref-napi');

// Constants
const DIGCF_PRESENT = 0x00000002;
const DIGCF_ALLCLASSES = 0x00000004;
const SPDRP_DEVICEDESC = 0x00000000;

// Function signatures
const setupApi = ffi.Library('setupapi', {
  'SetupDiGetClassDevsA': ['pointer', ['pointer', 'pointer', 'pointer', 'uint']],
  'SetupDiEnumDeviceInfo': ['int', ['pointer', 'uint', 'pointer']],
  'SetupDiGetDeviceRegistryPropertyA': ['int', ['pointer', 'pointer', 'uint', 'pointer', 'pointer', 'uint', 'pointer']],
  'SetupDiDestroyDeviceInfoList': ['int', ['pointer']],
});

// Struct for SP_DEVINFO_DATA
const SP_DEVINFO_DATA = new Buffer(28);  // Size of SP_DEVINFO_DATA structure

// Function to enumerate devices
function enumerateDevices() {
  const deviceInfoSet = setupApi.SetupDiGetClassDevsA(ref.NULL, ref.NULL, ref.NULL, DIGCF_PRESENT | DIGCF_ALLCLASSES);
  if (deviceInfoSet.isNull()) {
    console.error('Error opening device information set.');
    return;
  }

  const deviceInfoData = SP_DEVINFO_DATA;
  deviceInfoData.fill(0);
  deviceInfoData.type = ref.types.uint;  // Specify the type for casting

  for (let i = 0; setupApi.SetupDiEnumDeviceInfo(deviceInfoSet, i, deviceInfoData) !== 0; i++) {
    const deviceNameBuffer = Buffer.alloc(255);
    if (setupApi.SetupDiGetDeviceRegistryPropertyA(deviceInfoSet, deviceInfoData, SPDRP_DEVICEDESC,
        ref.NULL, deviceNameBuffer, deviceNameBuffer.length, ref.NULL) !== 0) {
      const deviceName = ref.readCString(deviceNameBuffer);
      console.log(`Device ${i + 1}: ${deviceName}`);
    }
  }

  setupApi.SetupDiDestroyDeviceInfoList(deviceInfoSet);
}

// Execute the enumeration
enumerateDevices();


