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

// const saveDriversToDatabase = async (driver, backupDate) => {
//   try {
//     const existingDrivers = await DriverModel.find({
//       DeviceName: driver.DeviceName,
//       DriverVersion: driver.DriverVersion,
//       backupDate: backupDate,
//     });

//     if (existingDrivers.length > 0) {
//       for (const existingDriver of existingDrivers) {
//         await DriverModel.deleteOne({ _id: existingDriver._id });
//       }
//     }
//     await DriverModel.create(driver);
//     console.log("Driver saved to database");
//   } catch (error) {
//     console.error("Error saving driver to database:", error);
//   }
// };

app.use(bodyParser.json());

// Function to save driver to database
const saveDriverToDatabase = async (driver, backupDate) => {
  try {
    const existingDriver = await DriverModel.findOne({
      DeviceName: driver.DeviceName,
      DriverVersion: driver.DriverVersion,
      backupDate: backupDate,
    });

    if (!existingDriver) {
      // Save the driver to the database only if it doesn't already exist
      await DriverModel.create({
        DeviceName: driver.DeviceName,
        DriverVersion: driver.DriverVersion,
        backupDate: backupDate,
      });
      console.log("Driver saved to database:", driver);
    } else {
      console.log("Driver already exists in the database:", existingDriver);
    }
  } catch (error) {
    console.error("Error saving driver to database:", error);
    throw error; // Propagate error for better error handling
  }
};

const saveBackupDateToDatabase = async (backupDate, driverData) => {
  try {
    const existingBackupDate = await DriverModel.findOne({
      backupDate: backupDate,
    });

    if (!existingBackupDate) {
      await DriverModel.create({ backupDate: backupDate });
      console.log("Backup date saved to database:", backupDate);

      await DriverModel.deleteMany({});
      console.log("All previous drivers deleted from the database.");

      // Save new drivers
      for (const driver of driverData) {
        await saveDriverToDatabase(driver, backupDate);
      }

      console.log("New drivers saved to the database.");
    } else {
      console.log("Backup date already exists in the database:", existingBackupDate.backupDate);
    }
  } catch (error) {
    console.error("Error saving backup date to database:", error);
    throw error; // Propagate error for better error handling
  }
};



app.post("/backupall", async (req, res) => {
  try {
    const { driverData, backupDate } = req.body; // Extract driverData and backupDate from request body
        const currentDate = new Date().toLocaleDateString("en-GB");

    const existingBackupDate = await DriverModel.findOne({
      backupDate: currentDate,
    });

    if (existingBackupDate) {
      return res.json({
        message: "Backup already performed for today",
        driversCount: driverData.length,
        backupDate: currentDate,
      });
    }

    for (const driver of driverData) {
      await saveDriverToDatabase(driver, backupDate);
    }
    await saveBackupDateToDatabase(backupDate);

    res.json({
      message: "Backup successful",
      driversCount: driverData.length,
      backupDate: backupDate,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});



// app.post("/backupall", async (req, res) => {
//   try {
//     const powershellScript = `
//       $driverInfo = Get-WmiObject Win32_PnPSignedDriver | Select-Object DeviceName, DriverVersion
//       ConvertTo-Json $driverInfo
//     `;

//     const powershell = spawn(powershellPath, [
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

//     powershell.on("exit", async (code) => {
//       if (code === 0) {
//         const parsedOutput = JSON.parse(output);
//         const currentDate = new Date().toLocaleDateString("en-GB");
//         const existingBackupDate = await DriverModel.findOne({
//           backupDate: currentDate,
//         });
//         if (existingBackupDate) {
//           return res.json({
//             message: "Backup already performed for today",
//             driversCount: parsedOutput,
//             backupDate: currentDate,
//           });
//         }
//         for (const driver of parsedOutput) {
//           await saveDriverToDatabase(driver);
//         }
//         await saveBackupDateToDatabase(currentDate);

//         res.json({
//           message: "Backup successful",
//           driversCount: parsedOutput,
//           backupDate: currentDate,
//         });
//       } else {
//         console.error(`PowerShell process exited with code ${code}`);
//         res.status(500).send(`PowerShell process exited with code ${code}`);
//       }
//     });
//   } 

//   catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });


app.get("/backupall", async (req, res) => {
  try {
    const drivers = await DriverModel.find();
    res.json(drivers);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

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
  DriverStatus:String,
  productID: String // Adding the productID field to the schema
});

const OutdatedDriver = mongoose.model('OutdatedDriver', outdatedDriverSchema);

app.use(bodyParser.json());

app.post('/api/outdatedDrivers', async (req, res) => {
  try {
    const { outdatedDrivers, productID } = req.body; // Extract outdatedDrivers and productID from the request body

    const newOutdatedDrivers = await filterOutExistingDrivers(outdatedDrivers);

    if (newOutdatedDrivers.length === 0) {
      return res.status(200).json({ message: 'No new outdated drivers to save' });
    }

    const outdatedDriversWithProductID = newOutdatedDrivers.map(driver => ({
      ...driver,
      productID
    }));
    await OutdatedDriver.insertMany(outdatedDriversWithProductID);

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

// Route handler for getting the count of outdated drivers
app.get('/api/outdatedDrivers/count', async (req, res) => {
  try {
    const outdatedDriversCount = await getOutdatedDriversCount();
    res.status(200).json({ count: outdatedDriversCount });
  } catch (error) {
    console.error('Error retrieving outdated drivers count:', error);
    res.status(500).json({ error: 'Failed to retrieve outdated drivers count' });
  }
});

// Function to get the count of outdated drivers
async function getOutdatedDriversCount() {
  const outdatedDriversCount = await OutdatedDriver.countDocuments({});
  return outdatedDriversCount;
}


async function checkDriverStatusesAndRemoveUpToDateDrivers() {
  try {
    const upToDateDrivers = await OutdatedDriver.find({ DriverStatus: "Up to date" });

    await OutdatedDriver.deleteMany({ DriverStatus: "Up to date" });

    console.log(`${upToDateDrivers.length} drivers with status "Up to date" removed from the database.`);
  } catch (error) {
    console.error('Error checking and removing drivers with status "Up to date":', error);
  }
}

app.put('/api/outdatedDrivers/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extract the unique ID from the request parameters
    await OutdatedDriver.findByIdAndUpdate(id, { DriverStatus: "Up to date" });
    await checkDriverStatusesAndRemoveUpToDateDrivers();
    res.status(200).json({ message: 'Driver status updated successfully' });
  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({ error: 'Failed to update driver status' });
  }
});

async function performLoginCheckDriverStatusesAndRemoveUpToDateDrivers() {
  try {
    await checkDriverStatusesAndRemoveUpToDateDrivers();
  } catch (error) {
    console.error('Error performing login check and removing drivers with status "Up to date":', error);
  }
}




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

