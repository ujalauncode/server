const express = require("express");
const cors = require("cors");
const bodyParser =require("body-parser")
const { exec } = require("child_process");
const { spawn } = require("child_process");
const mongoose = require("mongoose");

const powershellPath =
  "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
const app = express();
const port = process.env.port || 3000;
const { platform } = require("os");


app.use(
  cors({
    origin: "*",
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
  productID: String,
});

const DriverModel = mongoose.model("Driver", driverSchema);


app.use(bodyParser.json());

const saveDriverToDatabase = async (driver, backupDate, productID) => {
  try {
    const existingDrivers = await DriverModel.find({
      DeviceName: driver.DeviceName,
      DriverVersion: driver.DriverVersion,
      productID: productID
    }).sort({ backupDate: -1 });

    if (existingDrivers.length > 0) {
      await Promise.all(
        existingDrivers.slice(1).map(async (existingDriver) => {
          await existingDriver.remove();
          console.log("Old driver removed from database:", existingDriver);
        })
      );
    }

    await DriverModel.create({
      DeviceName: driver.DeviceName,
      DriverVersion: driver.DriverVersion,
      backupDate: backupDate,
      productID: productID
    });
    console.log("Driver saved to database:", driver);
  } catch (error) {
    console.error("Error saving driver to database:", error);
    throw error; // Propagate error for better error handling
  }
};

const saveBackupDateToDatabase = async (backupDate, driverData, productID) => {
  try {
    const existingBackupDate = await DriverModel.findOne({
      backupDate: backupDate,
      productID: productID
    });

    if (!existingBackupDate) {
      await DriverModel.create({ backupDate: backupDate, productID: productID });
      console.log("Backup date saved to database:", backupDate);

      await DriverModel.deleteMany({ productID: productID });
      console.log("All previous drivers deleted from the database.");

      // Save new drivers
      for (const driver of driverData) {
        await saveDriverToDatabase(driver, backupDate, productID);
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

app.post("/backupalldata", async (req, res) => {
  try {
    const { driverData, backupDate, productID } = req.body; // Extract driverData, backupDate, and productID from request body
    const currentDate = new Date().toLocaleDateString("en-GB");

    const existingBackupDate = await DriverModel.findOne({
      backupDate: currentDate,
      productID: productID
    });

    if (existingBackupDate) {
      return res.json({
        message: "Backup already performed for today",
        driversCount: driverData.length,
        backupDate: currentDate,
      });
    }

    for (const driver of driverData) {
      await saveDriverToDatabase(driver, backupDate, productID);
    }
    await saveBackupDateToDatabase(backupDate, driverData, productID);

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

app.get("/backupdate/:productID", async (req, res) => {
  try {
    const { productID } = req.params;

    const latestBackups = await DriverModel.find({ productID: productID });

    const uniqueDates = [];
    const seen = new Set();

    if (latestBackups.length > 0) {
      let latestBackupDates = latestBackups
        .map((data) => {
          return { _id: data._id, backupDate: data.backupDate };
        })
        .filter((date) => date.backupDate && isValidDate(date.backupDate));

      function removeDuplicateDates(latestBackupDates) {
        for (const item of latestBackupDates) {
          const { _id, backupDate } = item;
          if (!seen.has(backupDate)) {
            seen.add(backupDate);
            uniqueDates.push({ _id, backupDate });
          }
        }
        return uniqueDates;
      }

      const uniqueData = removeDuplicateDates(latestBackupDates);

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
  if (!outdatedDrivers || outdatedDrivers.length === 0) {
    return []; // Return an empty array if outdatedDrivers is undefined or empty
  }

  try {
    const existingDrivers = await OutdatedDriver.find({}); // Fetch all existing drivers from the database
    const existingDriverNamesAndProductIDs = existingDrivers.map(driver => ({
      driverName: driver.DeviceName,
      productID: driver.productID
    }));

    const newOutdatedDrivers = outdatedDrivers.filter(driver => {
      // Check if there's an existing driver with the same name but different productId
      const exists = existingDriverNamesAndProductIDs.some(existingDriver => {
        return existingDriver.driverName === driver.DeviceName && existingDriver.productID !== driver.productID;
      });

      return !exists;
    });

    return newOutdatedDrivers;
  } catch (error) {
    console.error('Error filtering existing drivers:', error);
    throw error; // Throw the error to propagate it to the caller
  }
}


app.get('/api/outdatedDrivers/count/:productID', async (req, res) => {
  try {
    const productID = req.params.productID;
    const outdatedDriversCount = await getOutdatedDriversCount(productID);
    res.status(200).json({ count: outdatedDriversCount });
  } catch (error) {
    console.error('Error retrieving outdated drivers count:', error);
    res.status(500).json({ error: 'Failed to retrieve outdated drivers count' });
  }
});

async function getOutdatedDriversCount(productID) {
  const outdatedDriversCount = await OutdatedDriver.countDocuments({ productID });
  return outdatedDriversCount;
}


app.get('/api/outdatedDrivers/:systemID', async (req, res) => {
  try {
    const systemID = req.params.systemID;
    const outdatedDrivers = await getOutdatedDriversBySystemID(systemID);
    res.status(200).json(outdatedDrivers);
  } catch (error) {
    console.error('Error retrieving outdated drivers for the system:', error);
    res.status(500).json({ error: 'Failed to retrieve outdated drivers for the system' });
  }
});

async function getOutdatedDriversBySystemID(systemID) {
  const outdatedDrivers = await OutdatedDriver.find({ productID: systemID });
  return outdatedDrivers;
}


app.put('/api/outdatedDrivers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id",id)
    const { productID } = req.body; // Extract the product ID from the request body

    await OutdatedDriver.findByIdAndUpdate(id, { DriverStatus: "Up to date", ProductID: productID });
    await checkDriverStatusesAndRemoveUpToDateDrivers();

    res.status(200).json({ message: 'Driver status updated successfully' });
  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({ error: 'Failed to update driver status' });
  }
});

async function checkDriverStatusesAndRemoveUpToDateDrivers() {
  try {
    const upToDateDrivers = await OutdatedDriver.find({ DriverStatus: "Up to date" });
    await OutdatedDriver.deleteMany({ DriverStatus: "Up to date" });
    console.log(`${upToDateDrivers.length} drivers with status "Up to date" removed from the database.`);
  } catch (error) {
    console.error('Error checking and removing drivers with status "Up to date":', error);
  }
}



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

