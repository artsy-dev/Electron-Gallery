// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const _require = require("esm")(module)
const url = require('url')

console.log(process.versions);

process.once('loaded', () => {
  global.require = _require
  global.resolveLocalURL = (filePath) => {
    if(/[a-zA-Z]:.+/.test(filePath)) {
      return location.protocol + '//localhost/__local_file__' + url.pathToFileURL(filePath).pathname;      
    } else if (/file:\/\/\/[a-zA-Z]:\/.+/.test(filePath)) {
      return location.protocol + '//localhost/__local_file__/' + /file:\/\/\/([a-zA-Z]:\/.+)/.exec(filePath)[1];
    } else {
      return filePath;
    }
  }
})