const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:1420",
  })
);

app.get("/",async(req,res)=>{
res.send({"status":"runnihg"})
})
// const systemInformation = {
//   "WAN Miniport (Network Monitor)": "10.0.22621.1",
//   "WAN Miniport (IPv6)": "10.0.22621.1",
//   "WAN Miniport (IP)": "10.0.22621.1",
//   "WAN Miniport (PPPOE)": "10.0.22621.1",
//   "WAN Miniport (PPTP)": "10.0.22621.1",
//   "WAN Miniport (L2TP)": "10.0.22621.1",
//   "WAN Miniport (IKEv2)": "10.0.22621.1",
//   "WAN Miniport (SSTP)": "10.0.22621.1",
//   "Generic software device": "10.0.22621.1",
//   "Local Print Queue": "10.0.22621.1",
//   "Local Print Queue": "10.0.22621.1",
//   "Local Print Queue": "10.0.22621.1",
//   "Generic software device": "10.0.22621.1",
//   "Generic software device": "10.0.22621.1",
//   "Generic software device": "10.0.22621.1",
//   "Generic software device": "10.0.22621.1",
//   "Generic software device": "10.0.22621.1",
//   "Computer Device": "10.0.22621.1",
//   "Remote Desktop Device Redirector Bus": "10.0.22621.2506",
//   "Plug and Play Software Device Enumerator": "10.0.22621.1",
//   "Microsoft System Management BIOS Driver": "10.0.22621.1",
//   "NDIS Virtual Network Adapter Enumerator": "10.0.22621.1",
//   "Microsoft Hyper-V Virtual Disk Server": "10.0.22621.2506",
//   "Microsoft Basic Render Driver": "10.0.22621.2506",
//   "Microsoft Hyper-V PCI Server": "10.0.22621.1",
//   "Acer Inc. System Firmware 1.26": "5.42.1.26",
//   "Microsoft UEFI-Compliant System": "10.0.22621.1",
//   "ACPI Thermal Zone": "10.0.22621.1",
//   "ACPI Fan": "10.0.22621.1",
//   "ACPI Fan": "10.0.22621.1",
//   "ACPI Fan": "10.0.22621.1",
//   "ACPI Fan": "10.0.22621.1",
//   "ACPI Fan": "10.0.22621.1",
//   "Motherboard resources": "10.0.22621.1",
//   "Trusted Platform Module 2.0": "10.0.22621.2506",
//   "HID-compliant wireless radio controls": "10.0.22621.2506",
//   "Acer Airplane Mode Controller": "1.0.0.10",
//   "HID-compliant system controller": "10.0.22621.2506",
//   "HID-compliant consumer control device": "10.0.22621.1",
//   "HID Keyboard Device": "10.0.22621.1",
//   "Converted Portable Device Control device": "10.0.22621.1",
//   "Portable Device Control device": "10.0.22621.1",
//   "Intel(R) HID Event Filter": "2.2.1.384",
//   "ACPI Power Button": "10.0.22621.1",
//   "Intel(R) Power Engine Plug-in": "10.0.22621.2792",
//   "Microsoft Windows Management Interface for ACPI": "10.0.22621.1",
//   "Microsoft Windows Management Interface for ACPI": "10.0.22621.1",
//   "ACPI Processor Aggregator": "10.0.22621.1",
//   "Intel Processor": "10.0.22621.2506",
//   "Intel Processor": "10.0.22621.2506",
//   "Intel Processor": "10.0.22621.2506",
//   "Intel Processor": "10.0.22621.2506",
//   "ACPI Sleep Button": "10.0.22621.1",
//   "Motherboard resources": "10.0.22621.1",
//   "Intel(R) Serial IO GPIO Host Controller - INT34C5": "30.100.2031.2",
//   "Motherboard resources": "10.0.22621.1",
//   "Motherboard resources": "10.0.22621.1",
//   "Microsoft Windows Management Interface for ACPI": "10.0.22621.1",
//   "Motherboard resources": "10.0.22621.1",
//   "Intel(R) SPI (flash) Controller - A0A4": "10.1.24.5",
//   "Intel(R) SMBus - A0A3": "10.1.24.5",
//   "Audio Endpoint": "10.0.22621.1",
//   "Realtek Audio Effects Component": "13.247.1124.210",
//   "Intel® Smart Sound Technology for Digital Microphones": "10.29.0.9677",
//   "Intel® Smart Sound Technology for Bluetooth® Audio": "10.29.0.9677",
//   "Intel® Smart Sound Technology for USB Audio": "10.29.0.9677",
//   "Audio Endpoint": "10.0.22621.1",
//   "Realtek Audio Universal Service": "1.0.668.0",
//   "Realtek Hardware Support Application": "11.0.6000.313",
//   "Realtek Audio Effects Component": "13.0.6000.1097",
//   "Realtek Audio": "6.0.9601.1",
//   "Intel® Smart Sound Technology Detection Verification": "1.0.3045.0",
//   "Intel® Smart Sound Technology OED": "10.29.0.9677",
//   "Intel® Smart Sound Technology BUS": "10.29.0.9677",
//   "ACPI Lid": "10.0.22621.1",
//   "Microsoft AC Adapter": "10.0.22621.1",
//   "Microsoft ACPI-Compliant Control Method Battery": "1.0.0.6",
//   "Microsoft ACPI-Compliant Embedded Controller": "10.0.22621.1",
//   "Standard PS/2 Keyboard": "10.0.22621.1",
//   "Motherboard resources": "10.0.22621.1",
//   "System timer": "10.0.22621.1",
//   "System CMOS/real time clock": "10.0.22621.1",
//   "Motherboard resources": "10.0.22621.1",
//   "Programmable interrupt controller": "10.0.22621.1",
//   "High precision event timer": "10.0.22621.1",
//   "Intel(R) LPC Controller/eSPI Controller (U Premium...": "10.1.24.5",
//   "Realtek PCIe GbE Family Controller": "10.63.1014.2022",
//   "Intel(R) PCI Express Root Port #9 - A0B0": "10.1.24.5",
//   "Intel(R) Serial IO I2C Host Controller - A0C6": "30.100.2031.2",
//   "Intel(R) Serial IO I2C Host Controller - A0C5": "30.100.2031.2",
//   "Intel RST VMD Managed Controller 09AB": "18.6.1.1016",
//   "Intel(R) Management and Security Application Local...": "2130.1.16.1",
//   "Intel(R) iCLS Client": "1.63.1155.1",
//   "Intel(R) Dynamic Application Loader Host Interface": "1.41.2021.121",
//   "Intel(R) Management Engine Interface #1": "2040.100.0.1029",
//   "Microsoft Input Configuration Device": "10.0.22621.1",
//   "HID-compliant touch pad": "10.0.22621.2506",
//   "HID-compliant vendor-defined device": "10.0.22621.2506",
//   "HID-compliant mouse": "10.0.22621.1",
//   "I2C HID Device": "10.0.22621.2506",
//   "Intel(R) Serial IO I2C Host Controller - A0EB": "30.100.2031.2",
//   "Intel(R) Serial IO I2C Host Controller - A0E8": "30.100.2031.2",
//   "Microsoft Wi-Fi Direct Virtual Adapter": "10.0.22621.1",
//   "Microsoft Wi-Fi Direct Virtual Adapter": "10.0.22621.1",
//   "Intel(R) Wireless-AC 9560 160MHz": "22.10.0.7",
//   "PCI standard RAM Controller": "10.0.22621.1",
//   "Microsoft Bluetooth LE Enumerator": "10.0.22621.2506",
//   "Bluetooth Device (Personal Area Network)": "10.0.22621.2506",
//   "Bluetooth Device": "10.0.22621.3007",
//   "Bluetooth Device": "10.0.22621.3007",
//   "Microsoft Bluetooth Hands-Free Profile AudioGatewa...": "10.0.22621.1",
//   "Microsoft Bluetooth Hands-Free Profile AudioGatewa...": "10.0.22621.1",
//   "Microsoft Bluetooth Avrcp Transport Driver": "10.0.22621.2506",
//   "Microsoft Bluetooth Avrcp Transport Driver": "10.0.22621.2506",
//   "Microsoft Bluetooth A2dp Source": "10.0.22621.1",
//   "Microsoft Bluetooth A2dp Source": "10.0.22621.1",
//   "Microsoft Bluetooth Enumerator": "10.0.22621.3007",
//   "Bluetooth Device (RFCOMM Protocol TDI)": "10.0.22621.2506",
//   "Intel(R) Wireless Bluetooth(R)": "22.230.0.2",
//   "WinUsb Device": "10.0.22621.2506",
//   "USB Video Device": "10.0.22621.2506",
//   "USB Composite Device": "10.0.22621.2506",
//   "USB Root Hub (USB 3.0)": "10.0.22621.2861",
//   "USB xHCI Compliant Host Controller": "10.0.22621.2506",
//   "Intel(R) Optane(TM) Memory and Storage Management ...": "18.6.1.1016",
//   "Generic software component": "10.0.22621.1",
//   "Disk drive": "10.0.22621.2506",
//   "Intel RST VMD Controller 9A0B": "18.6.1.1016",
//   "Intel(R) GNA Scoring Accelerator module": "2.0.0.1097",
//   "Generic PnP Monitor": "10.0.22621.2506",
//   "Intel(R) Graphics Command Center": "30.0.101.1404",
//   "Intel(R) Graphics Control Panel": "30.0.101.1404",
//   "Intel(R) UHD Graphics": "30.0.101.1404",
//   "PCI standard host CPU bridge": "10.0.22621.1",
//   "PCI Express Root Complex": "10.0.22621.2861",
//   "Microsoft ACPI-Compliant System": "10.0.22621.2792",
//   "ACPI x64-based PC": "10.0.22621.1",
//   "Charge Arbitration Driver": "10.0.22621.1",
//   "UMBus Root Bus Enumerator": "10.0.22621.2506",
//   "Microsoft Storage Spaces Controller": "10.0.22621.2792",
//   "Microsoft Virtual Drive Enumerator": "10.0.22621.1",
//   "Composite Bus Enumerator": "10.0.22621.1",
//   "Microsoft Hyper-V Virtualization Infrastructure Dr...": "10.0.22621.2715",
//   "Microsoft Hypervisor Service": "10.0.22621.2506",
//   "Microsoft Basic Display Driver": "10.0.22621.1",
//   "Microsoft Hyper-V Virtual Machine Bus Provider": "10.0.22621.2506",
//   "Volume": "10.0.22621.1",
//   "Generic volume shadow copy": "10.0.22621.1",
//   "Volume Manager": "10.0.22621.2506",
// }

// const formattedSystemInfoArray = [];

app.get("/getdrivers", async (req, res) => {
  try {
    const powershellScript = `
      $driverInfo = Get-WmiObject Win32_PnPSignedDriver | Select-Object DeviceName, DriverVersion, DriverStatus
      ConvertTo-Json $driverInfo
    `;

    const powershell = spawn("powershell.exe", [
      "-ExecutionPolicy",
      "Bypass",
      "-NoLogo",
      "-NoProfile",
      "-Command",
      powershellScript,
    ]);

    let output = "";

    powershell.stdout.on("data", (data) => {
      output += data.toString();
    });

    powershell.stderr.on("data", (data) => {
      console.error(`PowerShell Error: ${data}`);
      res.status(500).send(`PowerShell Error: ${data}`);
    });

    powershell.on("exit", (code) => {
      if (code === 0) {
        const parsedOutput = JSON.parse(output);
        res.json(parsedOutput);
        console.log(parsedOutput)
      } else {
        console.error(`PowerShell process exited with code ${code}`);
        res.status(500).send(`PowerShell process exited with code ${code}`);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


function bytesToGB(bytes) {
  const gigabytes = bytes / Math.pow(1024, 3);
  return gigabytes.toFixed(2); // Limit to two decimal places
}

function runWMICCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      const lines = stdout.trim().split('\n').filter(line => line.trim() !== '');
      const values = lines.slice(1).map(line => line.trim());

      resolve(values);
    });
  });
}

app.get('/systeminfo', async (req, res) => {
  try {
    const cpuInfo = await runWMICCommand('wmic cpu get name');
    const osInfo = await runWMICCommand('wmic os get Caption');
    const diskInfoBytes = await runWMICCommand('wmic diskdrive get size');
    const memoryInfoBytes = await runWMICCommand('wmic MEMORYCHIP get Capacity');
    const videoControllerInfo = await runWMICCommand('wmic path Win32_VideoController get name');


    // Convert disk size and memory capacity from bytes to GB
    const diskInfoGB = diskInfoBytes.map(bytes => bytesToGB(parseFloat(bytes)));
    const memoryInfoGB = memoryInfoBytes.map(bytes => bytesToGB(parseFloat(bytes)));

    const systemInfo = {
      cpuInfo,
      osInfo,
      diskInfo: diskInfoGB,
      memoryInfo: memoryInfoGB,
      videoControllerInfo,
    };

    res.json(systemInfo);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// const systemInformation = {
//   "WAN Miniport (Network Monitor)": "10.0.22621.1",
//   "WAN Miniport (IPv6)": "10.0.22621.1",
//   "WAN Miniport (IP)": "10.0.22621.1",
//   "WAN Miniport (PPPOE)": "10.0.22621.1",
//   "WAN Miniport (PPTP)": "10.0.22621.1",
//   "WAN Miniport (L2TP)": "10.0.22621.1",
//   "WAN Miniport (IKEv2)": "10.0.22621.1",
//   "WAN Miniport (SSTP)": "10.0.22621.1",
//   "Generic software device": "10.0.22621.1",
//   "Local Print Queue": "10.0.22621.1",
//   "Local Print Queue": "10.0.22621.1",
//   "Local Print Queue": "10.0.22621.1",
//   "Generic software device": "10.0.22621.1",
//   "Generic software device": "10.0.22621.1",
//   "Generic software device": "10.0.22621.1",
//   "Generic software device": "10.0.22621.1",
//   "Generic software device": "10.0.22621.1",
//   "Computer Device": "10.0.22621.1",
//   "Remote Desktop Device Redirector Bus": "10.0.22621.2506",
//   "Plug and Play Software Device Enumerator": "10.0.22621.1",
//   "Microsoft System Management BIOS Driver": "10.0.22621.1",
//   "NDIS Virtual Network Adapter Enumerator": "10.0.22621.1",
//   "Microsoft Hyper-V Virtual Disk Server": "10.0.22621.2506",
//   "Microsoft Basic Render Driver": "10.0.22621.2506",
//   "Microsoft Hyper-V PCI Server": "10.0.22621.1",
//   "Acer Inc. System Firmware 1.26": "5.42.1.26",
//   "Microsoft UEFI-Compliant System": "10.0.22621.1",
//   "ACPI Thermal Zone": "10.0.22621.1",
//   "ACPI Fan": "10.0.22621.1",
//   "ACPI Fan": "10.0.22621.1",
//   "ACPI Fan": "10.0.22621.1",
//   "ACPI Fan": "10.0.22621.1",
//   "ACPI Fan": "10.0.22621.1",
//   "Motherboard resources": "10.0.22621.1",
//   "Trusted Platform Module 2.0": "10.0.22621.2506",
//   "HID-compliant wireless radio controls": "10.0.22621.2506",
//   "Acer Airplane Mode Controller": "1.0.0.10",
//   "HID-compliant system controller": "10.0.22621.2506",
//   "HID-compliant consumer control device": "10.0.22621.1",
//   "HID Keyboard Device": "10.0.22621.1",
//   "Converted Portable Device Control device": "10.0.22621.1",
//   "Portable Device Control device": "10.0.22621.1",
//   "Intel(R) HID Event Filter": "2.2.1.384",
//   "ACPI Power Button": "10.0.22621.1",
//   "Intel(R) Power Engine Plug-in": "10.0.22621.2792",
//   "Microsoft Windows Management Interface for ACPI": "10.0.22621.1",
//   "Microsoft Windows Management Interface for ACPI": "10.0.22621.1",
//   "ACPI Processor Aggregator": "10.0.22621.1",
//   "Intel Processor": "10.0.22621.2506",
//   "Intel Processor": "10.0.22621.2506",
//   "Intel Processor": "10.0.22621.2506",
//   "Intel Processor": "10.0.22621.2506",
//   "ACPI Sleep Button": "10.0.22621.1",
//   "Motherboard resources": "10.0.22621.1",
//   "Intel(R) Serial IO GPIO Host Controller - INT34C5": "30.100.2031.2",
//   "Motherboard resources": "10.0.22621.1",
//   "Motherboard resources": "10.0.22621.1",
//   "Microsoft Windows Management Interface for ACPI": "10.0.22621.1",
//   "Motherboard resources": "10.0.22621.1",
//   "Intel(R) SPI (flash) Controller - A0A4": "10.1.24.5",
//   "Intel(R) SMBus - A0A3": "10.1.24.5",
//   "Audio Endpoint": "10.0.22621.1",
//   "Realtek Audio Effects Component": "13.247.1124.210",
//   "Intel® Smart Sound Technology for Digital Microphones": "10.29.0.9677",
//   "Intel® Smart Sound Technology for Bluetooth® Audio": "10.29.0.9677",
//   "Intel® Smart Sound Technology for USB Audio": "10.29.0.9677",
//   "Audio Endpoint": "10.0.22621.1",
//   "Realtek Audio Universal Service": "1.0.668.0",
//   "Realtek Hardware Support Application": "11.0.6000.313",
//   "Realtek Audio Effects Component": "13.0.6000.1097",
//   "Realtek Audio": "6.0.9601.1",
//   "Intel® Smart Sound Technology Detection Verification": "1.0.3045.0",
//   "Intel® Smart Sound Technology OED": "10.29.0.9677",
//   "Intel® Smart Sound Technology BUS": "10.29.0.9677",
//   "ACPI Lid": "10.0.22621.1",
//   "Microsoft AC Adapter": "10.0.22621.1",
//   "Microsoft ACPI-Compliant Control Method Battery": "1.0.0.6",
//   "Microsoft ACPI-Compliant Embedded Controller": "10.0.22621.1",
//   "Standard PS/2 Keyboard": "10.0.22621.1",
//   "Motherboard resources": "10.0.22621.1",
//   "System timer": "10.0.22621.1",
//   "System CMOS/real time clock": "10.0.22621.1",
//   "Motherboard resources": "10.0.22621.1",
//   "Programmable interrupt controller": "10.0.22621.1",
//   "High precision event timer": "10.0.22621.1",
//   "Intel(R) LPC Controller/eSPI Controller (U Premium...": "10.1.24.5",
//   "Realtek PCIe GbE Family Controller": "10.63.1014.2022",
//   "Intel(R) PCI Express Root Port #9 - A0B0": "10.1.24.5",
//   "Intel(R) Serial IO I2C Host Controller - A0C6": "30.100.2031.2",
//   "Intel(R) Serial IO I2C Host Controller - A0C5": "30.100.2031.2",
//   "Intel RST VMD Managed Controller 09AB": "18.6.1.1016",
//   "Intel(R) Management and Security Application Local...": "2130.1.16.1",
//   "Intel(R) iCLS Client": "1.63.1155.1",
//   "Intel(R) Dynamic Application Loader Host Interface": "1.41.2021.121",
//   "Intel(R) Management Engine Interface #1": "2040.100.0.1029",
//   "Microsoft Input Configuration Device": "10.0.22621.1",
//   "HID-compliant touch pad": "10.0.22621.2506",
//   "HID-compliant vendor-defined device": "10.0.22621.2506",
//   "HID-compliant mouse": "10.0.22621.1",
//   "I2C HID Device": "10.0.22621.2506",
//   "Intel(R) Serial IO I2C Host Controller - A0EB": "30.100.2031.2",
//   "Intel(R) Serial IO I2C Host Controller - A0E8": "30.100.2031.2",
//   "Microsoft Wi-Fi Direct Virtual Adapter": "10.0.22621.1",
//   "Microsoft Wi-Fi Direct Virtual Adapter": "10.0.22621.1",
//   "Intel(R) Wireless-AC 9560 160MHz": "22.10.0.7",
//   "PCI standard RAM Controller": "10.0.22621.1",
//   "Microsoft Bluetooth LE Enumerator": "10.0.22621.2506",
//   "Bluetooth Device (Personal Area Network)": "10.0.22621.2506",
//   "Bluetooth Device": "10.0.22621.3007",
//   "Bluetooth Device": "10.0.22621.3007",
//   "Microsoft Bluetooth Hands-Free Profile AudioGatewa...": "10.0.22621.1",
//   "Microsoft Bluetooth Hands-Free Profile AudioGatewa...": "10.0.22621.1",
//   "Microsoft Bluetooth Avrcp Transport Driver": "10.0.22621.2506",
//   "Microsoft Bluetooth Avrcp Transport Driver": "10.0.22621.2506",
//   "Microsoft Bluetooth A2dp Source": "10.0.22621.1",
//   "Microsoft Bluetooth A2dp Source": "10.0.22621.1",
//   "Microsoft Bluetooth Enumerator": "10.0.22621.3007",
//   "Bluetooth Device (RFCOMM Protocol TDI)": "10.0.22621.2506",
//   "Intel(R) Wireless Bluetooth(R)": "22.230.0.2",
//   "WinUsb Device": "10.0.22621.2506",
//   "USB Video Device": "10.0.22621.2506",
//   "USB Composite Device": "10.0.22621.2506",
//   "USB Root Hub (USB 3.0)": "10.0.22621.2861",
//   "USB xHCI Compliant Host Controller": "10.0.22621.2506",
//   "Intel(R) Optane(TM) Memory and Storage Management ...": "18.6.1.1016",
//   "Generic software component": "10.0.22621.1",
//   "Disk drive": "10.0.22621.2506",
//   "Intel RST VMD Controller 9A0B": "18.6.1.1016",
//   "Intel(R) GNA Scoring Accelerator module": "2.0.0.1097",
//   "Generic PnP Monitor": "10.0.22621.2506",
//   "Intel(R) Graphics Command Center": "30.0.101.1404",
//   "Intel(R) Graphics Control Panel": "30.0.101.1404",
//   "Intel(R) UHD Graphics": "30.0.101.1404",
//   "PCI standard host CPU bridge": "10.0.22621.1",
//   "PCI Express Root Complex": "10.0.22621.2861",
//   "Microsoft ACPI-Compliant System": "10.0.22621.2792",
//   "ACPI x64-based PC": "10.0.22621.1",
//   "Charge Arbitration Driver": "10.0.22621.1",
//   "UMBus Root Bus Enumerator": "10.0.22621.2506",
//   "Microsoft Storage Spaces Controller": "10.0.22621.2792",
//   "Microsoft Virtual Drive Enumerator": "10.0.22621.1",
//   "Composite Bus Enumerator": "10.0.22621.1",
//   "Microsoft Hyper-V Virtualization Infrastructure Dr...": "10.0.22621.2715",
//   "Microsoft Hypervisor Service": "10.0.22621.2506",
//   "Microsoft Basic Display Driver": "10.0.22621.1",
//   "Microsoft Hyper-V Virtual Machine Bus Provider": "10.0.22621.2506",
//   "Volume": "10.0.22621.1",
//   "Generic volume shadow copy": "10.0.22621.1",
//   "Volume Manager": "10.0.22621.2506",
// };

// const formattedSystemInfoArray = [];

// Object.keys(systemInformation).forEach(deviceName => {
//   const deviceInfo = {
//       DeviceName: deviceName,
//       DriverVersion: systemInformation[deviceName],
//       DriverStatus: null, // You can update this value based on your requirements
//   };
//   formattedSystemInfoArray.push(deviceInfo);
// });
// console.log(formattedSystemInfoArray)


// app.get("/getdrivers", async (req, res) => {
//   try {
//     function getDriverInfo() {
//       return new Promise((resolve, reject) => {
//         const powershellScript = `
//           $driverInfo = Get-WmiObject Win32_PnPSignedDriver | Select-Object DeviceName, DriverVersion, DriverStatus
//           ConvertTo-Json $driverInfo
//         `;

//         const powershell = spawn("powershell.exe", [
//           "-ExecutionPolicy",
//           "Bypass",
//           "-NoLogo",
//           "-NoProfile",
//           "-Command",
//           powershellScript,
//         ]);

//         let output = "";

//         powershell.stdout.on("data", (data) => {
//           output += data.toString();
//         });

//         powershell.stderr.on("data", (data) => {
//           console.error(`PowerShell Error: ${data}`);
//           reject(data.toString());
//         });

//         powershell.on("exit", (code) => {
//           if (code === 0) {
//             // Parse the output
//             const parsedOutput = JSON.parse(output);
//             console.log(parsedOutput);
//             resolve(parsedOutput);
//           } else {
//             console.error(`PowerShell process exited with code ${code}`);
//             reject(`PowerShell process exited with code ${code}`);
//           }
//         });
//       });
//     }

//     // Call the function to get driver information
//     const driverInfo = await getDriverInfo();
//     res.json(driverInfo);
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).send("Internal Server Error");
//   }
// });


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
