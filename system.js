const { spawn } = require("child_process");
const express = require("express");
const app = express();
const { exec } = require('child_process');
const { PowerShell } = require('node-powershell');

// app.get("/getdrivers", async (req, res) => {
//   try {
//     // PowerShell script to get information about drivers with available updates
//     const updateInfoScript = `
//       Get-WUInstall -MicrosoftUpdate -AcceptAll -AutoReboot | Format-Table -AutoSize | Out-String
//     `;

//     // Run the PowerShell script to get information about drivers with available updates with elevated privileges
//     const updateInfoProcess = spawn(powershellPath, [
//       "-NoProfile",
//       "-ExecutionPolicy",
//       "Bypass",
//       "-Command",
//       updateInfoScript,
//     ]);

//     let updateInfoOutput = "";

//     updateInfoProcess.stdout.on("data", (data) => {
//       updateInfoOutput += data.toString();
//     });

//     updateInfoProcess.stderr.on("data", (data) => {
//       console.error(`PowerShell Error (Update Info): ${data}`);
//       res.status(500).send(`PowerShell Error (Update Info): ${data}`);
//     });

//     updateInfoProcess.on("exit", (updateInfoCode) => {
//       if (updateInfoCode === 0) {
//         // Extract and format the desired information from the PowerShell output
//         const formattedUpdateInfo = updateInfoOutput
//           .split('\n')
//           .filter(line => line.trim() !== '')
//           .map(line => {
//             const columns = line.split(/\s+/);
//             return {
//               ComputerName: columns[0],
//               Status: columns[1],
//               KB: columns[2],
//               Size: columns[3],
//               Title: columns.slice(4).join(' ')
//             };
//           });

//         // Send the formatted update information in the response
//         res.json({
//           updateInfo: formattedUpdateInfo,
//         });
//       } else {
//         console.error(`PowerShell process (Update Info) exited with code ${updateInfoCode}`);
//         res.status(500).send(`PowerShell process (Update Info) exited with code ${updateInfoCode}`);
//       }
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });



// Define the PowerShell command

// Define the PowerShell command with elevated privileges



// Define the PowerShell command with elevated privileges

// Define the PowerShell command to get driver updates
// const powershellCommand = 'powershell.exe Get-WindowsUpdate -MicrosoftUpdate -AcceptAll | Select-Object -ExpandProperty Title';

// exec(powershellCommand, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error executing PowerShell command: ${error}`);
//     return;
//   }

//   console.log('Available driver updates:');
//   console.log(stdout);

//   if (stderr) {
//     console.error('Error:');
//     console.error(stderr);
//   }
// });

async function getAvailableUpdates() {
  const ps = new PowerShell();

  try {
      const command = 'Get-WUInstall -MicrosoftUpdate -AcceptAll -AutoReboot';

      await ps.addCommand(command);
      const output = await ps.invoke();
      console.log(output);
  } catch (err) {
      console.error(err);
  } finally {
      ps.dispose();
  }
}

getAvailableUpdates();

const port = 3006; 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
