const electron = require("electron");
const browserUtility = require("../modules/BrowserWindowUtility");
const path = require("path");
const fs = require("fs");
const {exec} = require("child_process");
const {download} = require('electron-dl');
const extract = require('extract-zip')
let configDir = (electron.app || electron.remote.app).getPath("userData");

module.exports.checkJavaInstallation = () => {
    // javaVersion();
    downloadJavaJDK();
}

function javaVersion() {
    var spawn = require('child_process').spawn('java', ['-version']);
    spawn.on('error', function(err){
        console.log("JAVA NOT INSTALLED");
        downloadJavaJDK();
    })
    spawn.stderr.on('data', function(data) {
        data = data.toString().split('\n')[0];
        var javaVersion = new RegExp('java version').test(data) ? data.split(' ')[2].replace(/"/g, '') : false;
        if (javaVersion != false) {
            // We have Java installed
            console.log(`JAVA VERSION ${javaVersion} is installed`);
        } else {
            // No Java installed
            console.log("JAVA NOT INSTALLED");
            downloadJavaJDK();
        }
    });
}

function downloadJavaJDK() {
    let jdkConfigPath = path.join(
        configDir,
        "jdk"
    );
    
    if (fs.existsSync(jdkConfigPath)) {
        console.log("jdk folder exists");
    } else {
        let win = browserUtility.getBrowserWindow();
        download(win, "https://api.adoptopenjdk.net/v3/binary/version/jdk-17.0.1+12/windows/x64/jdk/hotspot/normal/adoptopenjdk", {directory: configDir}).then((value) => {
            let sourceZip = path.join(configDir, value.getFilename());
            extract(sourceZip, { dir: jdkConfigPath });
        });
    }
    let currentPath = process.env.PATH;
    let newPath = currentPath.concat(";", path.join(configDir, "/jdk/jdk-17.0.1+12/bin"));
    process.env.PATH = newPath;
    
}