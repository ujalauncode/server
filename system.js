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


