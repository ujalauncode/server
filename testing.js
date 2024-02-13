const express = require('express');
const mongoose = require('mongoose');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());

// Define your Mongoose model
const YourModel = mongoose.model('YourModel', new mongoose.Schema({
  DeviceName: String,
  DriverVersion: String,
  backupDate: String,
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourDatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the express server
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

  app.post("/backupall", async (req, res) => {
    try {
      const powershellScript = `
        $driverInfo = Get-WmiObject Win32_PnPSignedDriver | Select-Object DeviceName, DriverVersion
        ConvertTo-Json $driverInfo
      `;
  
      const powershell = spawn(powershellPath, [
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
  
      powershell.on("exit", async (code) => {
        if (code === 0) {
          const parsedOutput = JSON.parse(output);
          const currentDate = new Date().toLocaleDateString('en-GB'); 
  
          for (const driver of parsedOutput) {
            // Save each driver along with the backup date
            await saveDriverToDatabase(driver, currentDate);
          }
  
          res.json({
            message: "Backup successful",
            driversCount: parsedOutput.length, // Corrected property name
            backupDate: currentDate,
          });
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

// GET endpoint to retrieve unique backup dates
app.get("/uniquebackupdates", async (req, res) => {
  try {
    const uniqueBackupDates = await YourModel.distinct("backupDate");
    
    res.json({
      uniqueBackupDates: uniqueBackupDates,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function saveDriverToDatabase(driver, backupDate) {
  try {
    const newDriver = new YourModel({
      DeviceName: driver.DeviceName,
      DriverVersion: driver.DriverVersion,
      backupDate: backupDate,
    });

    await newDriver.save();
  } catch (error) {
    console.error("Error saving driver to the database:", error);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
