const browserUtility = require("./BrowserWindowUtility");
const { BROWSER_EVENTS } = require("./constants");

let browserWindow;

module.exports.logToConsole = (message, level) => {
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send(BROWSER_EVENTS.BUILD, {message, level});
}
