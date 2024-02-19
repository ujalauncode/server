
// const { exec } = require('child_process');

// // Command to open PowerShell as administrator
// const command = 'Start-Process powershell -Verb RunAs';

// // Execute the command
// exec(`powershell.exe -Command "${command}"`, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`Error opening PowerShell: ${error}`);
//         return;
//     }
//     console.log(`PowerShell opened as administrator.`);
// });



// const { exec } = require('child_process');

// // Command to open PowerShell as administrator
// const command = 'Start-Process powershell -Verb RunAs -ArgumentList "-Command \"& { Get-WUInstall -MicrosoftUpdate -AcceptAll -AutoReboot }\""';

// // Execute the command
// exec(command, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`Error opening PowerShell: ${error}`);
//         return;
//     }
//     console.log(`PowerShell opened as administrator.`);
// });


// const { exec } = require('child_process');

// // Command to execute Get-WUInstall with elevated privileges
// const command = 'powershell.exe -ExecutionPolicy Bypass -Command "Start-Process powershell -ArgumentList \' -NoProfile -ExecutionPolicy Bypass -Command \"Get-WUInstall -MicrosoftUpdate -AcceptAll -AutoReboot\"\' -Verb RunAs"';

// // Execute the command
// exec(command, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`Error executing PowerShell command: ${error}`);
//         return;
//     }
//     console.log(`PowerShell command executed successfully.`);
//     console.log(stdout);
// });





// const { exec } = require('child_process');

// const command = 'powershell.exe -ExecutionPolicy Bypass -Command "Start-Process powershell -ArgumentList \' -NoExit -NoProfile -ExecutionPolicy Bypass -Command \"Get-WUInstall -MicrosoftUpdate -AcceptAll -AutoReboot\"\' -Verb RunAs"';
// exec(command, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`Error executing PowerShell command: ${error}`);
//         return;
//     }
//     console.log(`PowerShell command executed successfully.`);
//     console.log(stdout);
// });



const { exec } = require('child_process');

const installCommands = [
    'Install-Module -Name PSWindowsUpdate -Force -AllowClobber -Scope CurrentUser',
    'Import-Module PSWindowsUpdate',
];
const updateCommand = 'Get-WUInstall -MicrosoftUpdate -AcceptAll -AutoReboot';
function executePowerShellCommands(commands, index = 0) {
    if (index >= commands.length) {
        console.log('All PowerShell commands executed successfully.');
        executeUpdateCommand();
        return;
    }
    const command = commands[index];
    const powershellCommand = `powershell.exe -ExecutionPolicy Bypass -Command "${command}"`;
    exec(powershellCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing PowerShell command "${command}": ${error}`);
            return;
        }
        console.log(`PowerShell command "${command}" executed successfully.`);
        console.log(stdout);

        executePowerShellCommands(commands, index + 1);
    });
}

function executeUpdateCommand() {
    const checkCommand = 'powershell.exe -Command "Get-Module -ListAvailable -Name PSWindowsUpdate"';

    exec(checkCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error checking module existence: ${error}`);
            return;
        }

        if (stdout.includes('PSWindowsUpdate')) {
            // Module is installed and imported, execute the update command
            execUpdateCommand();
        } else {
            console.log('PSWindowsUpdate module is not installed and imported.');
        }
    });
}
function execUpdateCommand() {
    const command = `powershell.exe -ExecutionPolicy Bypass -Command "Start-Process powershell -ArgumentList '-NoExit -NoProfile -ExecutionPolicy Bypass -Command \\"${updateCommand}\\"' -Verb RunAs"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing update command: ${error}`);
            return;
        }
        console.log('Update command executed successfully.');
        console.log(stdout);
    });
}
executePowerShellCommands(installCommands);









