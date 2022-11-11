"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var databaseUtility = require("./DatabaseUtility");

var validationUtility = require("./ValidationUtility");

var browserUtility = require("./BrowserWindowUtility");

var loggingUtility = require("./LoggingUtility");

var electron = require("electron");

var path = require("path");

var _require = require("./constants"),
    STATUSES = _require.STATUSES,
    CONSOLE_MESSAGE_TYPES = _require.CONSOLE_MESSAGE_TYPES;

var _require2 = require("child_process"),
    spawn = _require2.spawn,
    exec = _require2.exec;

var configDir = (electron.app || electron.remote.app).getPath("userData");

var Templator = require("./template/Templator").Templator;

var browserWindow;
var pid;
var mcProcess;

module.exports.compileProject = function _callee(project) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve) {
            var projectData = databaseUtility.getProjectDataByName(project);
            var execPath = path.join(configDir, "projects", projectData.name, "source");
            mcProcess = exec("gradlew build", {
              cwd: execPath
            }, function (error, stdout, stderr) {
              if (!error) {
                loggingUtility.logToConsole(stdout, CONSOLE_MESSAGE_TYPES.GAME);
              } else {// loggingUtility.logToConsole(
                //   "Done with errors... ",
                //   CONSOLE_MESSAGE_TYPES.GAME
                // );
              }

              resolve({
                status: error ? STATUSES.ERROR : STATUSES.SUCCESS,
                message: stdout
              });
            });
            mcProcess.stdout.on("data", function (data) {
              loggingUtility.logToConsole(data, CONSOLE_MESSAGE_TYPES.GAME);
            });
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.buildProject = function _callee2(project) {
  "use strict";

  var projectData, validation_errors, templator, initialResults, templator_errors, execPath;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          browserWindow = browserUtility.getBrowserWindow();
          projectData = databaseUtility.getProjectDataByName(project);
          validation_errors = validationUtility.validateModElement(projectData);

          if (!validation_errors.length) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", Promise.resolve({
            "errors": validation_errors
          }));

        case 5:
          templator = new Templator(projectData);
          templator.deleteOldFiles();
          _context2.next = 9;
          return regeneratorRuntime.awrap(templator.run());

        case 9:
          initialResults = _context2.sent;
          templator_errors = initialResults.reduce(function (arr, response) {
            var reason = response.reason;
            return response.status === 'rejected' ? [].concat(_toConsumableArray(arr), [{
              message: "Error in  ".concat(reason.instanceName, ".\n") + "Method: ".concat(reason.method, "\n") + "".concat(reason.error.toString()),
              status: STATUSES.ERROR
            }]) : _toConsumableArray(arr);
          }, []);

          if (!templator_errors.length) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", Promise.resolve({
            "errors": templator_errors
          }));

        case 13:
          execPath = path.join(configDir, "projects", projectData.name, "source");
          return _context2.abrupt("return", new Promise(function (resolve) {
            //let mcProcess = spawn("gradlew runClient",[], {cwd: execPath, shell: true});
            mcProcess = exec("gradlew runClient", {
              cwd: execPath
            }, function (error, stdout, stderr) {
              if (!error) {
                loggingUtility.logToConsole(stdout, CONSOLE_MESSAGE_TYPES.GAME);
              } else {// loggingUtility.logToConsole(
                //   "Done with errors... ",
                //   CONSOLE_MESSAGE_TYPES.GAME
                // );
              }

              resolve({
                status: error ? STATUSES.ERROR : STATUSES.SUCCESS,
                message: stdout
              });
            });
            pid = mcProcess.pid; // mcProcess.addListener("exit", function() {
            //   exitEventListener.call(this, resolve);
            // })

            mcProcess.on("exit", function (code, signal) {
              resolve({
                status: STATUSES.SUCCESS,
                message: "app exited"
              });
            });
            mcProcess.stdout.on("data", function (data) {
              loggingUtility.logToConsole(data, CONSOLE_MESSAGE_TYPES.GAME);
            });
          }));

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
};

function exitEventListener(resolve) {
  resolve({
    status: STATUSES.SUCCESS,
    message: "Process exited"
  });
}

module.exports.stopClient = function () {
  if (pid) {
    try {
      mcProcess.kill('SIGTERM');
      console.log('Process %s has been killed!', pid);
    } catch (error) {
      console.log(error);
    }
  }
};