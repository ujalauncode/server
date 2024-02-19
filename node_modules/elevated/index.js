/**
 * @author Cédric Tailly
 * @description Check if script is executed in an elevated mode : with sudo on Linux and from an administrator account on Windows.
 */

const win32 = require('os').platform() == 'win32';

module.exports.message = win32 ? "Administrator privileges required" : "SUDO required";

module.exports.check = () => {

  if ( !win32 )
    return process.getuid() == 0 || !!process.env.SUDO_UID;

  try {
    require('child_process').execSync('net session', { stdio: 'ignore'})
    return true;
  } catch (error) {
    return false;
  }
};

module.exports.required = () => {
  if ( !module.exports.check() )
    throw new Error(module.exports.message);
};
