"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require("electron"),
    dialog = _require.dialog,
    shell = _require.shell;

var fs = require("fs");

var _require2 = require('csv-parse'),
    parse = _require2.parse;

var _require3 = require("electron"),
    app = _require3.app,
    remote = _require3.remote;

var path = require("path");

var AdmZip = require("adm-zip");

var _require4 = require("./DatabaseUtility"),
    getProjectDataByName = _require4.getProjectDataByName,
    getProjectNodesByName = _require4.getProjectNodesByName,
    addProject = _require4.addProject,
    writeProjects = _require4.writeProjects,
    getProjects = _require4.getProjects,
    initializeProjectDirectories = _require4.initializeProjectDirectories;

module.exports.saveFile = function _callee(_ref) {
  var dialogTitle, defaultPath, content, _ref2, filePath, promise;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          dialogTitle = _ref.dialogTitle, defaultPath = _ref.defaultPath, content = _ref.content;
          _context.next = 3;
          return regeneratorRuntime.awrap(dialog.showSaveDialog({
            title: dialogTitle,
            defaultPath: defaultPath,
            properties: ["createDirectory", "showOverwriteConfirmation"]
          }));

        case 3:
          _ref2 = _context.sent;
          filePath = _ref2.filePath;

          if (filePath) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", Promise.resolve({
            status: "canceled"
          }));

        case 7:
          promise = new Promise(function (resolve, reject) {
            fs.writeFile(filePath, content, function (error) {
              if (error) {
                reject({
                  status: "error",
                  message: error
                });
              } else {
                resolve({
                  status: "success",
                  message: "File saved successfully"
                });
              }
            });
          });
          return _context.abrupt("return", promise);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.openFolder = function _callee2() {
  var pathSegments,
      appFolder,
      targetFolder,
      _args2 = arguments;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          pathSegments = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : [];
          appFolder = (app || remote.app).getPath("userData");
          targetFolder = path.join.apply(path, [appFolder].concat(_toConsumableArray(pathSegments)));
          return _context2.abrupt("return", shell.openPath(targetFolder));

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.openExternalLink = function _callee3() {
  var url,
      _args3 = arguments;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          url = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : '';

          if (!(url === '')) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return");

        case 3:
          return _context3.abrupt("return", shell.openExternal(url));

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.exportProject = function _callee4(projectName) {
  var appFolder, projectContentFolder, projectConfig, projectData, projectNodes, _ref3, filePath;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          appFolder = (app || remote.app).getPath("userData");
          projectContentFolder = path.join(appFolder, "projects", projectName);
          projectConfig = getProjects().find(function (p) {
            return p.name === projectName;
          });
          projectData = getProjectDataByName(projectName);
          projectNodes = getProjectNodesByName(projectName);
          _context4.next = 7;
          return regeneratorRuntime.awrap(dialog.showSaveDialog({
            title: "Save project",
            defaultPath: "mmm-app-".concat(projectName, ".zip"),
            filters: [{
              name: "Zip archives only",
              extensions: ["zip"]
            }],
            properties: ["createDirectory", "showOverwriteConfirmation"]
          }));

        case 7:
          _ref3 = _context4.sent;
          filePath = _ref3.filePath;

          if (filePath) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", Promise.resolve({
            status: "canceled"
          }));

        case 11:
          return _context4.abrupt("return", new Promise(function (resolve) {
            try {
              var zip = new AdmZip();
              zip.addLocalFolder(projectContentFolder, "projects/".concat(projectName));
              zip.addFile("ProjectData.json", Buffer.from(JSON.stringify(projectData), "utf8"));
              zip.addFile("ProjectNodes.json", Buffer.from(JSON.stringify(projectNodes), "utf8"));
              zip.addFile("ProjectDetails.json", Buffer.from(JSON.stringify(projectConfig), "utf-8"));
              zip.writeZip(filePath, function (error) {
                if (error) {
                  throw error;
                }

                resolve({
                  status: "success",
                  message: "Project exported successfully",
                  filePath: filePath
                });
              });
            } catch (error) {
              resolve({
                status: "error",
                message: error.message
              });
            }
          }));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.exportProjectData = function _callee5(projectName) {
  var projectData, _ref4, filePath, promise;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          projectData = getProjectDataByName(projectName);
          _context5.next = 3;
          return regeneratorRuntime.awrap(dialog.showSaveDialog({
            title: "Save project",
            defaultPath: "ProjectData.json",
            filters: [{
              name: "JSON files only",
              extensions: ["json"]
            }],
            properties: ["createDirectory", "showOverwriteConfirmation"]
          }));

        case 3:
          _ref4 = _context5.sent;
          filePath = _ref4.filePath;

          if (filePath) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", Promise.resolve({
            status: "canceled"
          }));

        case 7:
          promise = new Promise(function (resolve, reject) {
            fs.writeFile(filePath, Buffer.from(JSON.stringify(projectData), "utf8"), function (error) {
              if (error) {
                reject({
                  status: "error",
                  message: error
                });
              } else {
                resolve({
                  status: "success",
                  message: "File saved successfully"
                });
              }
            });
          });
          return _context5.abrupt("return", promise);

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.importProject = function _callee6() {
  var appFolder, _ref5, canceled, filePaths;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          appFolder = (app || remote.app).getPath("userData");
          _context6.next = 3;
          return regeneratorRuntime.awrap(dialog.showOpenDialog({
            properties: ["openFile"],
            filters: [{
              name: "Zip archives only",
              extensions: ["zip"]
            }]
          }));

        case 3:
          _ref5 = _context6.sent;
          canceled = _ref5.canceled;
          filePaths = _ref5.filePaths;

          if (!canceled) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", Promise.resolve({
            status: "canceled"
          }));

        case 8:
          return _context6.abrupt("return", new Promise(function (resolve) {
            try {
              var file = filePaths[0];
              var zip = new AdmZip(file);
              var zipEntries = zip.getEntries();
              var configEntries = ["ProjectDetails.json", "ProjectData.json", "ProjectNodes.json"];
              var projectDetailsFile = zip.getEntry(configEntries[0]);
              var projectDataFile = zip.getEntry(configEntries[1]);
              var projectNodesFile = zip.getEntry(configEntries[2]);

              if (!projectDataFile || !projectNodesFile || !projectDetailsFile) {
                throw new Error("Format not compatible");
              }

              var projectDetails = JSON.parse(projectDetailsFile.getData().toString());
              var projectData = JSON.parse(projectDataFile.getData().toString());
              var projectNodes = JSON.parse(projectNodesFile.getData().toString());

              if (getProjectDataByName(projectData.name)) {
                throw new Error("Project ".concat(projectData.name, " exists"));
              }

              addProject({
                projectData: projectData,
                projectNodes: projectNodes
              });
              var projects = getProjects();
              writeProjects([].concat(_toConsumableArray(projects), [projectDetails]));
              var projectFiles = zipEntries.filter(function (entry) {
                return !configEntries.includes(entry.name);
              });
              initializeProjectDirectories(projectData.name);
              projectFiles.forEach(function (entry) {
                zip.extractEntryTo(entry, appFolder, true, true);
              });
              resolve({
                status: "success",
                message: "Project imported successfully"
              });
            } catch (error) {
              resolve({
                status: "error",
                message: error.message
              });
            }
          }));

        case 9:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports.getTooltipValue = function _callee7() {
  var data, csvPath;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          data = [];
          csvPath = path.join(__dirname, '../src/assets/data/tooltip.csv');
          _context7.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            fs.createReadStream(csvPath, 'utf-8').pipe(parse({
              delimiter: ',',
              skip_empty_lines: true,
              columns: true,
              bom: true
            })).on('data', function (row) {
              data.push(row);
            }).on('end', function () {
              resolve();
            });
          }));

        case 4:
          return _context7.abrupt("return", data);

        case 5:
        case "end":
          return _context7.stop();
      }
    }
  });
};