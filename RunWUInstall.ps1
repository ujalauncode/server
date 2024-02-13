Import-Module PSWindowsUpdate
Install-Module -Name PSWindowsUpdate -Force -AllowClobber
Get-WUInstall -MicrosoftUpdate -AcceptAll -AutoReboot
