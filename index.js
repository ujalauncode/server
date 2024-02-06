const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const { spawn } = require("child_process");
const mongoose = require("mongoose");
const powershellPath =
  "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";

// const childProcess = spawn(powershellPath, [
//     '-ExecutionPolicy',
//     'Bypass',
//     '-NoLogo',
//     '-NoProfile',
//     '-Command',
//     '$driverInfo = Get-WmiObject Win32_PnPSignedDriver | Select-Object DeviceName, DriverVersion, DriverStatus; ConvertTo-Json $driverInfo'
// ]);
const powershellScript = `
    Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -File "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"' -Verb RunAs
`;
const app = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:1420",
  })
);

mongoose.connect("mongodb://localhost:27017/driversdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const driverSchema = new mongoose.Schema({
  DeviceName: String,
  DriverVersion: String,
});

const DriverModel = mongoose.model('Driver', driverSchema);
const saveDriverToDatabase = async (driver) => {
  try {
    // Check if the driver already exists in the database
    const existingDriver = await DriverModel.findOne({
      DeviceName: driver.DeviceName,
      DriverVersion: driver.DriverVersion,
    });

    if (!existingDriver) {
      // If the driver doesn't exist, insert a new record
      await DriverModel.create(driver);
    }
  } catch (error) {
    console.error('Error saving driver to database:', error);
  }
};

app.post('/backupall', async (req, res) => {
  try {
    const powershellScript = `
      $driverInfo = Get-WmiObject Win32_PnPSignedDriver | Select-Object DeviceName, DriverVersion
      ConvertTo-Json $driverInfo
    `;

    const powershell = spawn('powershell.exe', [
      '-ExecutionPolicy',
      'Bypass',
      '-NoLogo',
      '-NoProfile',
      '-Command',
      powershellScript,
    ]);

    let output = '';

    powershell.stdout.on('data', (data) => {
      output += data.toString();
    });

    powershell.stderr.on('data', (data) => {
      console.error(`PowerShell Error: ${data}`);
      res.status(500).send(`PowerShell Error: ${data}`);
    });

    powershell.on('exit', async (code) => {
      if (code === 0) {
        const parsedOutput = JSON.parse(output);
        // console.log(parsedOutput.driversCount)

        // Store each driver in the database
        for (const driver of parsedOutput) {
          await saveDriverToDatabase(driver);
        }

        res.json({
          message: 'Backup successful',
          driversCount: parsedOutput,
        });
      } else {
        console.error(`PowerShell process exited with code ${code}`);
        res.status(500).send(`PowerShell process exited with code ${code}`);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/totalcount', async (req, res) => {
  try {
    const totalCount = await DriverModel.countDocuments();
    res.json({ totalCount });
  } catch (error) {
    console.error('Error getting total count:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/", async (req, res) => {
  res.send({ status: "runnihg" });
});

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
        // console.log(parsedOutput);
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
      const lines = stdout
        .trim()
        .split("\n")
        .filter((line) => line.trim() !== "");
      const values = lines.slice(1).map((line) => line.trim());

      resolve(values);
    });
  });
}
app.get("/systeminfo", async (req, res) => {
  try {
    const cpuInfo = await runWMICCommand("wmic cpu get name");
    const osInfo = await runWMICCommand("wmic os get Caption");
    const diskInfoBytes = await runWMICCommand("wmic diskdrive get size");
    const memoryInfoBytes = await runWMICCommand(
      "wmic MEMORYCHIP get Capacity"
    );
    const videoControllerInfo = await runWMICCommand(
      "wmic path Win32_VideoController get name"
    );

    // Convert disk size and memory capacity from bytes to GB
    const diskInfoGB = diskInfoBytes.map((bytes) =>
      bytesToGB(parseFloat(bytes))
    );
    const memoryInfoGB = memoryInfoBytes.map((bytes) =>
      bytesToGB(parseFloat(bytes))
    );

    const systemInfo = {
      cpuInfo,
      osInfo,
      diskInfo: diskInfoGB,
      memoryInfo: memoryInfoGB,
      videoControllerInfo,
    };

    res.json(systemInfo);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
