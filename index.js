const express = require("express");
const cors = require("cors");
const bodyParser =require("body-parser")
const { exec } = require("child_process");
const { spawn } = require("child_process");
const mongoose = require("mongoose");

const powershellPath =
  "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
const app = express();
const port = 3000;
const { platform } = require("os");

app.use(
  cors({
    origin: "http://localhost:1420",
  })
);

mongoose.connect(
  "mongodb+srv://user1:user123@cluster0.g1p3xeq.mongodb.net/driversdbs"
);

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const driverSchema = new mongoose.Schema({
  DeviceName: String,
  DriverVersion: String,
  backupDate: String,
});

const DriverModel = mongoose.model("Driver", driverSchema);

const saveDriverToDatabase = async (driver, backupDate) => {
  try {
    const existingDrivers = await DriverModel.find({
      DeviceName: driver.DeviceName,
      DriverVersion: driver.DriverVersion,
      backupDate: backupDate,
    });

    if (existingDrivers.length > 0) {
      for (const existingDriver of existingDrivers) {
        await DriverModel.deleteOne({ _id: existingDriver._id });
      }
    }
    await DriverModel.create(driver);
    console.log("Driver saved to database");
  } catch (error) {
    console.error("Error saving driver to database:", error);
  }
};

async function saveDriversToDatabase(drivers) {
  try {
    // Save each driver to the database
    for (const driver of drivers) {
      const newDriver = new Driver({
        DeviceName: driver.DeviceName,
        DriverVersion: driver.DriverVersion,
        backupDate: driver.backupDate
      });
      await newDriver.save();
    }
  } catch (error) {
    console.error('Error saving drivers to database:', error);
    throw error;
  }
}


app.post("/backupall", async (req, res) => {
  // try {
  //   const powershellScript = `
  //     $driverInfo = Get-WmiObject Win32_PnPSignedDriver | Select-Object DeviceName, DriverVersion
  //     ConvertTo-Json $driverInfo
  //   `;

  //   const powershell = spawn(powershellPath, [
  //     "-ExecutionPolicy",
  //     "Bypass",
  //     "-NoLogo",
  //     "-NoProfile",
  //     "-Command",
  //     powershellScript,
  //   ]);

  //   let output = "";

  //   powershell.stdout.on("data", (data) => {
  //     output += data.toString();
  //   });

  //   powershell.stderr.on("data", (data) => {
  //     console.error(`PowerShell Error: ${data}`);
  //     res.status(500).send(`PowerShell Error: ${data}`);
  //   });

  //   powershell.on("exit", async (code) => {
  //     if (code === 0) {
  //       const parsedOutput = JSON.parse(output);
  //       const currentDate = new Date().toLocaleDateString("en-GB");
  //       const existingBackupDate = await DriverModel.findOne({
  //         backupDate: currentDate,
  //       });
  //       if (existingBackupDate) {
  //         return res.json({
  //           message: "Backup already performed for today",
  //           driversCount: parsedOutput,
  //           backupDate: currentDate,
  //         });
  //       }
  //       for (const driver of parsedOutput) {
  //         await saveDriverToDatabase(driver);
  //       }
  //       await saveBackupDateToDatabase(currentDate);

  //       res.json({
  //         message: "Backup successful",
  //         driversCount: parsedOutput,
  //         backupDate: currentDate,
  //       });
  //     } else {
  //       console.error(`PowerShell process exited with code ${code}`);
  //       res.status(500).send(`PowerShell process exited with code ${code}`);
  //     }
  //   });
  // } 
  try {
    const { driversCount } = req.body;
    await saveDriversToDatabase(driversCount);
    res.json({ message: 'Backup data received and saved successfully' });
  }
  catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/backupall", async (req, res) => {
  try {
    const drivers = await DriverModel.find();
    res.json(drivers);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// app.get("/backupall/drivers", async (req, res) => {
//   try {
//     // Fetch all drivers from the database
//     const drivers = await DriverModel.find();

//     res.json({
//       drivers: DeviceName,
//       drivers:DriverVersion
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.delete("/backupdate/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const deletedBackupDate = await DriverModel.findByIdAndDelete(id);

    if (deletedBackupDate) {
      res.json({
        message: "Backup date deleted successfully",
        deletedBackupDate,
      });
    } else {
      res.status(404).json({
        message: "Backup date not found",
      });
    }
  } catch (error) {
    console.error("Error deleting backup date:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/backupdate", async (req, res) => {
  try {
    const latestBackups = await DriverModel.find({});

    const uniqueDates = [];
    const seen = new Set();

    if (latestBackups.length > 0) {
      // Filter out null values and invalid dates
      // const latestBackupDates = latestBackups
      //   .map(({ backupDate }) => backupDate)
      //   .filter(date => date && isValidDate(date));

      let latestBackupDates = latestBackups
        .map((data) => {
          return { _id: data._id, backupDate: data.backupDate };
        })
        .filter((date) => date.backupDate && isValidDate(date.backupDate));

      console.log("latestBackupDates", latestBackupDates);

      function removeDuplicateDates(latestBackupDates) {
        for (const item of latestBackupDates) {
          const { _id, backupDate } = item;
          if (!seen.has(backupDate)) {
            seen.add(backupDate);
            console.log("_id", _id);

            uniqueDates.push({ _id, backupDate });
          }
        }

        return uniqueDates;
      }

      const uniqueData = removeDuplicateDates(latestBackupDates);
      console.log("unique data =", uniqueData);

      const sortedData = uniqueData.sort((a, b) => {
        const dateA = new Date(a.backupDate.split("/").reverse().join("/"));
        const dateB = new Date(b.backupDate.split("/").reverse().join("/"));
        return dateB - dateA;
      });

      if (sortedData.length > 0) {
        res.json({
          sortedData,
        });
      } else {
        res.json({
          message: "No valid backup dates found in the database",
        });
      }
    } else {
      res.json({
        message: "No backup dates found in the database",
      });
    }
  } catch (error) {
    console.error("Error retrieving latest backup dates:", error);
    res.status(500).send("Internal Server Error");
  }
});

function isValidDate(dateString) {
  const pattern = /^\d{2}\/\d{2}\/\d{4}$/;
  return pattern.test(dateString);
}

app.get("/totalcount", async (req, res) => {
  try {
    const totalCount = await DriverModel.countDocuments();

    res.json({ totalCount });
  } catch (error) {
    console.error("Error getting total count:", error);
    res.status(500).send("Internal Server Error");
  }
});

const outdatedDriverSchema = new mongoose.Schema({
  DeviceName: String,
  DriverVersion: String,
});

const OutdatedDriver = mongoose.model('OutdatedDriver', outdatedDriverSchema);

app.use(bodyParser.json());
app.post('/api/outdatedDrivers', async (req, res) => {
  try {
    const { outdatedDrivers } = req.body;

    const newOutdatedDrivers = await filterOutExistingDrivers(outdatedDrivers);

    if (newOutdatedDrivers.length === 0) {
      return res.status(200).json({ message: 'No new outdated drivers to save' });
    }
    await OutdatedDriver.insertMany(newOutdatedDrivers);

    res.status(201).json({ message: 'Outdated drivers saved successfully' });
  } catch (error) {
    console.error('Error saving outdated drivers:', error);
    res.status(500).json({ error: 'Failed to save outdated drivers' });
  }
});
async function filterOutExistingDrivers(outdatedDrivers) {
  const existingDrivers = await OutdatedDriver.find({}); // Fetch all existing drivers from the database
  const existingDriverNames = new Set(existingDrivers.map(driver => driver.driverName));
  const newOutdatedDrivers = outdatedDrivers.filter(driver => !existingDriverNames.has(driver.driverName));

  return newOutdatedDrivers;
}


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

