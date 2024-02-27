// const express = require('express');
// const { exec } = require('child_process');
// const { MongoClient } = require('mongodb');
// const powershellPath = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'
// // const elevate = require('node-windows').elevate;
// const { platform } = require('os');

// const app = express();
// const port = 5000;

// // MongoDB Connection URI
// const uri = 'mongodb://localhost:27017';
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect().then(() => {
//     console.log('Connected to MongoDB');
// }).catch(err => {
//     console.error('Error connecting to MongoDB:', err);
// });

// app.post('/saveQfeData', (req, res) => {
//     exec('wmic qfe list brief /format:table', (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error: ${error.message}`);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         if (stderr) {
//             console.error(`stderr: ${stderr}`);
//             res.status(500).send('Internal Server Error');
//             return;
//         }

//         // Parse the stdout and process the data
//         const lines = stdout.split('\n').map(line => line.trim()).filter(line => line !== '');
//         const data = lines.slice(2).map(line => {
//             const [des, HotFixId] = line.split(/\s{2,}/);
//             return { des,HotFixId  };
//         });

//         // Save data to MongoDB collection
//         const collection = client.db('drivers_restore').collection('restore');
//         collection.insertMany(data).then(result => {
//             console.log('Data inserted:', result.insertedCount);
//             res.json({ message: 'Data inserted successfully' });
//         }).catch(err => {
//             console.error('Error inserting data into MongoDB:', err);
//             res.status(500).send('Internal Server Error');
//         });
//     });
// });


// app.post('/saveQfeData', (req, res) => {
//     exec('wmic qfe list brief /format:table', (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error: ${error.message}`);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         if (stderr) {
//             console.error(`stderr: ${stderr}`);
//             res.status(500).send('Internal Server Error');
//             return;
//         }

//         // Parse the stdout and process the data
//         const lines = stdout.split('\n').map(line => line.trim()).filter(line => line !== '');
//         const data = lines.slice(2).map(line => {
//             const [des, HotFixId] = line.split(/\s{2,}/);
//             return { des, HotFixId };
//         });

//         // Save data to MongoDB collection if it doesn't already exist
//         const collection = client.db('drivers_restore').collection('restore');
//         const promises = data.map(item => {
//             return collection.findOne({ HotFixId: item.HotFixId })
//                 .then(existingItem => {
//                     if (!existingItem) {
//                         return collection.insertOne(item);
//                     }
//                 });
//         });

//         Promise.all(promises)
//             .then(() => {
//                 console.log('Data inserted successfully');
//                 res.json({ message: 'Data inserted successfully' });
//             })
//             .catch(err => {
//                 console.error('Error inserting data into MongoDB:', err);
//                 res.status(500).send('Internal Server Error');
//             });
//     });
// });

// app.get('/saveQfeData', (req, res) => {
//     // Access the MongoDB collection
//     const collection = client.db('drivers_restore').collection('restore');

//     // Retrieve data from MongoDB including only the 'des' and 'HotFixId' fields
//     collection.find({}, { projection: { _id: 0, des: 1, HotFixId: 1 } }).toArray((err, data) => {
//         if (err) {
//             console.error('Error fetching data from MongoDB:', err);
//             res.status(500).send('Internal Server Error');
//             return;
//         }

//         // Send the data as a response
//         res.json(data);
//     });
// });

// // Run the command to install Windows updates

// if (platform() === 'win32') {
//     const elevateCmd = 'powershell.exe -Command "Start-Process powershell -ArgumentList \\"-Command Install-WindowsUpdate -AcceptAll -AutoReboot\\" -Verb RunAs"';
    
//     app.post('/api/install-windows-update', (req, res) => {
//       exec(elevateCmd, (error, stdout, stderr) => {
//         if (error) {
//           console.error(`Error executing command: ${error}`);
//           return res.status(500).json({ status: 'Error', message: 'Failed to install updates.' });
//         }
//         console.log(`stdout: ${stdout}`);
//         console.error(`stderr: ${stderr}`);
//         res.json({ status: 'Success', message: 'Updates installed successfully.' });
//       });
//     });
//   } else {
//     // Handle non-Windows platforms
//     app.post('/api/install-windows-update', (req, res) => {
//       res.status(500).json({ status: 'Error', message: 'This functionality is only available on Windows.' });
//     });
//   }





// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

// // const { exec } = require('child_process');

// // // Commands to execute sequentially in PowerShell
// // const commands = [
// //     'Install-Module -Name PSWindowsUpdate -Force -AllowClobber -Scope CurrentUser',
// //     'Import-Module PSWindowsUpdate',
// //     'Start-Process powershell -ArgumentList \'-NoProfile -ExecutionPolicy Bypass -Command "Get-WUInstall -MicrosoftUpdate -AcceptAll -AutoReboot"\' -Verb RunAs'
// // ];

// // function executePowerShellCommands(commands, index = 0) {
// //     if (index >= commands.length) {
// //         console.log('All PowerShell commands executed successfully.');
// //         return;
// //     }

// //     const command = commands[index];
// //     const powershellCommand = `powershell.exe -ExecutionPolicy Bypass -Command "${command}"`;

// //     exec(powershellCommand, (error, stdout, stderr) => {
// //         if (error) {
// //             console.error(`Error executing PowerShell command "${command}": ${error}`);
// //             return;
// //         }
// //         console.log(`PowerShell command "${command}" executed successfully.`);
// //         console.log(stdout);

// //         // Execute the next command recursively
// //         executePowerShellCommands(commands, index + 1);
// //     });
// // }

// // executePowerShellCommands(commands);


// // const { exec } = require('child_process');

// // // Path to the PowerShell script
// // const scriptPath = 'updateScript.ps1';

// // exec(`powershell.exe -File ${scriptPath}`, (error, stdout, stderr) => {
// //     if (error) {
// //         console.error(`Error: ${error.message}`);
// //         return;
// //     }
// //     if (stderr) {
// //         console.error(`Command stderr: ${stderr}`);
// //         return;
// //     }
// //     console.log(`Command stdout: ${stdout}`);
// // });





// const si = require("systeminformation");
 
//  async function systemInfo(){


//     function bytesToGB(bytes) {
//         const gigabytes = bytes / Math.pow(1024, 3);
//         return gigabytes.toFixed(2); // Limit to two decimal places
//       }
//     console.log('hello')

//     try {
//       const cpuInfo = await si.cpu();
//       const osInfo = await si.osInfo();
//       const diskInfo = await si.diskLayout();
//       const memoryInfo = await si.mem();
//       const videoControllerInfo = await si.graphics();

//     //   const diskInfoGB = diskInfo.map((bytes) =>
//     //   bytesToGB(parseFloat(bytes))
//     // );
//     // const memoryInfoGB = memoryInfo.map((bytes) =>
//     //   bytesToGB(parseFloat(bytes))
//     // );
  
//     const systemInfo = {
//         cpuInfo,
//         osInfo,
//         diskInfo,
//         memoryInfo,
//         videoControllerInfo,
//       };
  
//     //   res.json(systemInfo);
//     console.log("system info =",systemInfo)
//     } catch (err) {
//       console.error("Error:", err.message);
//     //   res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// systemInfo()
  



const si = require("systeminformation");

async function systemInfo() {
    function bytesToGB(bytes) {
        const gigabytes = bytes / Math.pow(1024, 3);
        return gigabytes.toFixed(2); // Limit to two decimal places
    }

    console.log('hello');

    try {
        const cpuInfo = await si.cpu();
        const osInfo = await si.osInfo();
        const diskInfo = await si.diskLayout();
        const memoryInfo = await si.mem();
        const videoControllerInfo = await si.graphics();

        // Convert diskInfo to GB
        const diskInfoGB = diskInfo.map(disk => ({
            ...disk,
            size: bytesToGB(disk.size)
        }));

        // Convert memoryInfo to GB
        const memoryInfoGB = {
            total: bytesToGB(memoryInfo.total),
            free: bytesToGB(memoryInfo.free),
            used: bytesToGB(memoryInfo.used)
        };

        const systemInfo = {
            cpuInfo,
            osInfo,
            diskInfo: diskInfoGB,
            memoryInfo: memoryInfoGB,
            videoControllerInfo
        };

        console.log("system info =", systemInfo);
    } catch (err) {
        console.error("Error:", err.message);
    }
};

systemInfo();
