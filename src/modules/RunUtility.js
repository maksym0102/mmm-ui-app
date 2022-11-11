const databaseUtility = require("./DatabaseUtility");
const validationUtility = require("./ValidationUtility");
const browserUtility = require("./BrowserWindowUtility");
const loggingUtility = require("./LoggingUtility");
const electron = require("electron");
const path = require("path");
const { STATUSES, CONSOLE_MESSAGE_TYPES } = require("./constants");
let {spawn, exec} = require("child_process");
let configDir = (electron.app || electron.remote.app).getPath("userData");
const Templator = require("./template/Templator").Templator;

let browserWindow;
let pid;
let mcProcess;
module.exports.compileProject = async (project) => {
  return new Promise((resolve) => {
    const projectData = databaseUtility.getProjectDataByName(project);
    const execPath = path.join(configDir, "projects", projectData.name, "source");
    mcProcess = exec(
      "gradlew build",
      {
        cwd: execPath,
      },
      (error, stdout, stderr) => {
        if (!error) {
          loggingUtility.logToConsole(stdout, CONSOLE_MESSAGE_TYPES.GAME);
        } else {
          // loggingUtility.logToConsole(
          //   "Done with errors... ",
          //   CONSOLE_MESSAGE_TYPES.GAME
          // );
        }
        resolve({
          status: error ? STATUSES.ERROR : STATUSES.SUCCESS,
          message: stdout,
        });
      }
    );

    mcProcess.stdout.on("data", function(data) {
      loggingUtility.logToConsole(data, CONSOLE_MESSAGE_TYPES.GAME);
    });
  });
};

module.exports.buildProject = async (project) => {
  ("use strict");
  browserWindow = browserUtility.getBrowserWindow();
  const projectData = databaseUtility.getProjectDataByName(project);

  const validation_errors = validationUtility.validateModElement(projectData);

  if (validation_errors.length) {
    return Promise.resolve({ "errors": validation_errors });
  }

  const templator = new Templator(projectData);
  templator.deleteOldFiles();
  const initialResults = await templator.run();

  const templator_errors = initialResults.reduce((arr, response) => {
    const reason = response.reason;
    return response.status === 'rejected' ? [...arr, {
      message: 
        `Error in  ${reason.instanceName}.\n` + 
        `Method: ${reason.method}\n` + 
        `${reason.error.toString()}`
      ,
      status: STATUSES.ERROR
    }] : [...arr]
  }, [])

  if (templator_errors.length) {
    return Promise.resolve({ "errors": templator_errors });
  }

  const execPath = path.join(configDir, "projects", projectData.name, "source");

  return new Promise((resolve) => {
    //let mcProcess = spawn("gradlew runClient",[], {cwd: execPath, shell: true});
    mcProcess = exec(
      "gradlew runClient",
      {
        cwd: execPath,
      },
      (error, stdout, stderr) => {
        if (!error) {
          loggingUtility.logToConsole(stdout, CONSOLE_MESSAGE_TYPES.GAME);
        } else {
          // loggingUtility.logToConsole(
          //   "Done with errors... ",
          //   CONSOLE_MESSAGE_TYPES.GAME
          // );
        }
        resolve({
          status: error ? STATUSES.ERROR : STATUSES.SUCCESS,
          message: stdout,
        });
      }
    );
    
    pid = mcProcess.pid;

    // mcProcess.addListener("exit", function() {
    //   exitEventListener.call(this, resolve);
    // })
    mcProcess.on("exit", function(code, signal) {
      resolve({
        status: STATUSES.SUCCESS,
        message: "app exited"
      });
    });
    mcProcess.stdout.on("data", function(data) {
      loggingUtility.logToConsole(data, CONSOLE_MESSAGE_TYPES.GAME);
    });
  });
};

function exitEventListener(resolve) {
  resolve(
    {
      status: STATUSES.SUCCESS,
      message: "Process exited"
    }
  )
}

module.exports.stopClient = () => {
  if (pid) {
    try {
      mcProcess.kill('SIGTERM');
      console.log( 'Process %s has been killed!', pid );
    } catch (error) {
      console.log(error);
    }
  }
}
