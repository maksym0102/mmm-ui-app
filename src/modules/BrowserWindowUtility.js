const { BrowserWindow } = require("electron");

let _browserWindow;

module.exports.setBrowserWindow = (browserWindow) => {
    this._browserWindow = browserWindow;
    console.log(this._browserWindow);
}

module.exports.getBrowserWindow = () => {
    return this._browserWindow;
}