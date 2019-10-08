// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
var _require = require("esm")(module)

process.once('loaded', () => {
  global.require = _require
})