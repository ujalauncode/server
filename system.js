// const { spawn } = require("child_process");
// const express = require("express");
// const cors = require("cors");

// const app = express();
// const port = 3002;

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );





// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// // Endpoint to get driver information
// app.get("/getdriverinfo", async (req, res) => {
//   try {
//     const powershellScript = `
//       $driverInfo = Get-WmiObject Win32_PnPSignedDriver | Select-Object DeviceName, DriverVersion, DriverStatus
//       ConvertTo-Json $driverInfo
//     `;

//     const powershell = spawn("powershell.exe", [
//       "-ExecutionPolicy",
//       "Bypass",
//       "-NoLogo",
//       "-NoProfile",
//       "-Command",
//       powershellScript,
//     ]);

//     let output = "";

//     powershell.stdout.on("data", (data) => {
//       output += data.toString();
//     });

//     powershell.stderr.on("data", (data) => {
//       console.error(`PowerShell Error: ${data}`);
//       res.status(500).send(`PowerShell Error: ${data}`);
//     });

//     powershell.on("exit", (code) => {
//       if (code === 0) {
//         const parsedOutput = JSON.parse(output);
//         res.json(parsedOutput);
//       } else {
//         console.error(`PowerShell process exited with code ${code}`);
//         res.status(500).send(`PowerShell process exited with code ${code}`);
//       }
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const express = require('express');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(express.json());

app.post('/backupDrivers', (req, res) => {
  const backupFolder = path.join(__dirname, 'DriverBackup');

  // Ensure the destination folder exists
  if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder);
  }

  try {
    // Run PowerShell command to get driver information
    const powershellCmd = 'Get-WindowsDriver -Online -All';
    const driversInfo = execSync(`powershell -Command "${powershellCmd}"`, { encoding: 'utf-8' });

    // Parse PowerShell output to extract driver paths
    const driverPaths = driversInfo.split('\n')
      .filter(line => line.trim().startsWith('Published Name'))
      .map(line => line.split(':').slice(1).join(':').trim());

    // Copy each driver file to the destination folder
    driverPaths.forEach(driverPath => {
      const driverFileName = path.basename(driverPath);
      const destinationPath = path.join(backupFolder, driverFileName);
      fs.copyFileSync(driverPath, destinationPath);
    });

    res.json({ success: true, message: 'Driver backup successful.' });
  } catch (error) {
    console.error(`Error during driver backup: ${error}`);
    res.status(500).json({ success: false, message: 'Failed to back up drivers.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

