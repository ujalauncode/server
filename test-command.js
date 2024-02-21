// const { exec } = require('child_process');
// exec('wmic qfe list brief /format:table', (error, stdout, stderr) => {
//     if (error) {
//         console.error(`Error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.error(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(stdout);
// });


// its working fine

// UNINSTALL UPDATE
// const { exec } = require('child_process');

// // Replace 'kb:4100347' with the actual KB number you want to uninstall
// const kbNumber = 'kb:5034765';

// const command = `wusa.exe /uninstall /${kbNumber}`;

// exec(command, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`Error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.error(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
//     console.log('Update uninstalled successfully.');
// });




// const { exec } = require('child_process');
// const runas = require('runas');

// // Define your PowerShell command
// const command = 'Get-WUInstall -MicrosoftUpdate -AcceptAll -AutoReboot';

// // Execute PowerShell command with elevated privileges
// runas(`powershell.exe -Command "${command}"`, { admin: true }, function(error, stdout, stderr) {
//   if (error) {
//     console.error(`Error: ${error.message}`);
//     return;
//   }
//   if (stderr) {
//     console.error(`stderr: ${stderr}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
// });

