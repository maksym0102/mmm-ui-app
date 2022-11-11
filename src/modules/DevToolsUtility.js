const browserUtility = require("./BrowserWindowUtility");
const { BROWSER_EVENTS } = require("./constants");

let browserWindow;

module.exports.toggleDevTools = async () => {
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.toggleDevTools();
    browserWindow.webContents.on('devtools-opened', () => {
        // Can't use mainWindow.webContents.devToolsWebContents.on("before-input-event") - it just doesn't intercept any events.
        browserWindow.webContents.devToolsWebContents.executeJavaScript(`
            new Promise((resolve)=> {
                reslove();
            })
        `).then(() => {
            browserWindow.webContents.toggleDevTools();
        });
    });
}
