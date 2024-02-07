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

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { spawn } = require("child_process");

const app = express();
const port = 3000;

// CORS setup
app.use(
  cors({
    origin: "http://localhost:1420",
  })
);

// MongoDB connection
mongoose.connect("mongodb+srv://user1:user123@cluster0.g1p3xeq.mongodb.net/driversdbs", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Mongoose models
const driverSchema = new mongoose.Schema({
  DeviceName: String,
  DriverVersion: String,
});

const DriverModel = mongoose.model("Driver", driverSchema);

// Helper function to save driver to the database
const saveDriverToDatabase = async (driver) => {
  try {
    await DriverModel.updateOne(
      { DeviceName: driver.DeviceName },
      { $set: driver },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error saving driver to database:", error);
  }
};

// Route to backup drivers
app.post("/backup", async (req, res) => {
  try {
    const powershellScript = `
      $driverInfo = Get-WmiObject Win32_PnPSignedDriver | Select-Object DeviceName, DriverVersion
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

    powershell.on("exit", async (code) => {
      if (code === 0) {
        const parsedOutput = JSON.parse(output);

        // Store each driver in the database
        for (const driver of parsedOutput) {
          await saveDriverToDatabase(driver);
        }

        res.json({
          message: "Backup successful",
          driversCount: parsedOutput.length,
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

// Route to get drivers
app.get("/drivers", async (req, res) => {
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



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

