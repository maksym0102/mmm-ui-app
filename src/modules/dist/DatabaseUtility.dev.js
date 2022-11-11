"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var JSONdb = require("simple-json-db");

var _require = require("electron"),
    app = _require.app,
    remote = _require.remote;

var path = require("path");

var fs = require("fs");

var fse = require("fs-extra");

var _require2 = require("./constants"),
    STATUSES = _require2.STATUSES;

var configDir = (app || remote.app).getPath("userData");
var jsonDbConfig = {
  jsonSpaces: 2
};
var db;
var dataDb;
var nodesDb;

var DbError =
/*#__PURE__*/
function (_Error) {
  _inherits(DbError, _Error);

  _createClass(DbError, null, [{
    key: "getDetails",
    value: function getDetails(details) {
      return Object.entries(details).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return "".concat(key, ": ").concat(value);
      }).join("\n\t");
    }
  }]);

  function DbError(message) {
    var _this;

    var details = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, DbError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DbError).call(this, "".concat(message, ". Details: \n\t").concat(DbError.getDetails(details))));
    _this.name = "DatabaseError";
    return _this;
  }

  return DbError;
}(_wrapNativeSuper(Error));
/**
 * Given a database and a new piece of data, add the new data to the database
 * @param db - The database object.
 * @param newData - The data you want to push to the database.
 * @param [key=data] - The key to store the data under.
 */


var pushData = function pushData(db, newData) {
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "data";
  db.set(key, [].concat(_toConsumableArray(db.get(key)), [newData]));
};
/**
 * Add a new element to an array of elements in a project
 * @param db - The database object.
 * @param projectName - The name of the project you want to add the element to.
 * @param type - The type of element you want to add.
 * @param content - The content of the mod.
 * @param [key=data] - The key of the data you want to update.
 */


var saveModElementToDb = function saveModElementToDb(db, projectName, type, content) {
  var key = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "data";
  var data = db.get(key);
  var updatedData = data.map(function (project) {
    if (project.name === projectName) {
      return _objectSpread({}, project, _defineProperty({}, type, [].concat(_toConsumableArray(project[type]), [content])));
    }

    return project;
  });
  db.set(key, updatedData);
};
/**
 * Update the mod element data field in the database
 * @param db - the database object
 * @param projectName - The name of the project you want to update.
 * @param type - The type of element you want to update.
 * @param entryName - The name of the entry you want to update.
 * @param content - The data field and value you want to update.
 * @param [key=data] - The key in the database where the data is stored.
 */


var updateModElementDataFieldInDb = function updateModElementDataFieldInDb(db, projectName, type, entryName, content) {
  var key = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "data";
  var data = db.get(key);
  var updatedData = data.map(function (project) {
    if (project.name === projectName) {
      return _objectSpread({}, project, _defineProperty({}, type, project[type].map(function (entry) {
        if (entry.name === entryName) {
          var datafield = content.datafield,
              datavalue = content.datavalue;
          entry.data[datafield] = datavalue;
          return entry;
        }

        return entry;
      })));
    }

    return project;
  });
  db.set(key, updatedData);
};
/**
 * Update the mod element in the database
 * @param db - the database object
 * @param projectName - The name of the project you want to update.
 * @param type - The type of element you want to update.
 * @param entryName - The name of the entry you want to update.
 * @param content - The content of the element you want to update.
 * @param [key=data] - The key in the database where the data is stored.
 */


var updateModElementInDb = function updateModElementInDb(db, projectName, type, entryName, content) {
  var key = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "data";
  var data = db.get(key);
  var updatedData = data.map(function (project) {
    if (project.name === projectName) {
      return _objectSpread({}, project, _defineProperty({}, type, project[type].map(function (entry) {
        if (entry.name === entryName) {
          return content;
        }

        return entry;
      })));
    }

    return project;
  });
  db.set(key, updatedData);
};
/**
 * Update the mod element in the database
 * @param db - the database object
 * @param projectName - The name of the project you want to update.
 * @param type - The type of element you want to update.
 * @param entryName - The name of the entry you want to update.
 * @param content - The content of the element you want to update.
 * @param [key=data] - The key in the database where the data is stored.
 */


var updateModElementNameInDb = function updateModElementNameInDb(db, projectName, type, oldEntryName, newEntryName) {
  var key = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "data";
  var data = db.get(key);
  console.log("data:", data); // const updatedData = data.map((project) => {
  //   if (project.name === projectName) {
  //     return {
  //       ...project,
  //       [type]: project[type].map((entry) => {
  //         if (entry.name === entryName) {
  //           return content;
  //         }
  //         return entry;
  //       }),
  //     };
  //   }
  //   return project;
  // });
  // db.set(key, updatedData);
};
/**
 * Update the nodes for an element in the database
 * @param db - the database object
 * @param projectName - The name of the project you want to update.
 * @param type - The type of element you want to update.
 * @param entryName - The name of the entry you want to update.
 * @param content - The content of the element you want to update.
 * @param [key=data] - The key in the database where the data is stored.
 */


var updateNodesInDb = function updateNodesInDb(db, projectName, type, entryName, content) {
  var key = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "data";
  var data = db.get(key);
  console.log(data);
  var updatedData = data.map(function (project) {
    if (project.name === projectName) {
      return _objectSpread({}, project, _defineProperty({}, type, project[type].map(function (entry) {
        if (entry.name === entryName) {
          return {
            name: entry.name,
            nodes: content
          };
        }

        return entry;
      })));
    }

    return project;
  });
  db.set(key, updatedData);
};
/**
 * Get a mod element from the database
 * @param db - The database object.
 * @param projectName - The name of the project you want to get the mod from.
 * @param type - The type of mod element you want to get.
 * @param entryName - The name of the element you want to get.
 * @param [key=data] - The key in the database where the data is stored.
 * @returns The mod element from the database.
 */


var getModElementFromDb = function getModElementFromDb(db, projectName, type, entryName) {
  var key = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "data";
  var data = db.get(key);
  var project = data.find(function (project) {
    return project.name === projectName;
  });
  return project ? project[type].find(function (element) {
    return element.name === entryName;
  }) : null;
};
/**
 * Remove a mod element from the database
 * @param db - The database object.
 * @param projectName - The name of the project you want to remove the element from.
 * @param type - The type of element to remove.
 * @param entryName - The name of the entry to be removed.
 * @param [key=data] - The key in the database where the data is stored.
 */


var removeModElementFromDb = function removeModElementFromDb(db, projectName, type, entryName) {
  var key = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "data";
  var data = db.get(key);
  var updatedData = data.map(function (project) {
    if (project.name === projectName) {
      return _objectSpread({}, project, _defineProperty({}, type, project[type].filter(function (item) {
        return item.name !== entryName;
      })));
    }

    return project;
  });
  db.set(key, updatedData);
};
/**
 * Remove an item from a list of items by project name
 * @param db - The database object.
 * @param projectName - The name of the project to remove.
 * @param [key=data] - The key of the data you want to remove.
 */


var removeItemByProjectName = function removeItemByProjectName(db, projectName) {
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "data";
  var data = db.get(key);
  var updatedData = data.filter(function (project) {
    return project.name !== projectName;
  });
  db.set(key, updatedData);
};

module.exports.initializeDatabase = function () {
  db = new JSONdb(path.join(configDir, "ProjectConfig.json"), jsonDbConfig);
  dataDb = new JSONdb(path.join(configDir, "ProjectData.json"), jsonDbConfig);
  nodesDb = new JSONdb(path.join(configDir, "ProjectNodes.json"), jsonDbConfig);

  try {
    if (!db.has("projects")) {
      db.set("projects", []);
    }

    if (!dataDb.has("data")) {
      dataDb.set("data", []);
    }

    if (!nodesDb.has("data")) {
      nodesDb.set("data", []);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.initializeProjectDirectories = function _callee(projectName) {
  var projectPaths, placeholderTexturePath, placeholders, modPath, resourceAssetsPath, resourceDataPath, mcResourceDataPath;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          projectPaths = [path.join(configDir, "projects", projectName, "image", "texture")];
          projectPaths.forEach(function (path) {
            fs.mkdirSync(path, {
              recursive: true
            });
          });
          placeholderTexturePath = path.join(app.getAppPath(), "..", "src", "assets", "img", "placeholders");
          placeholders = fs.readdirSync(placeholderTexturePath); // Copy the placeholder textures to the project's texture folder

          placeholders.forEach(function (placeholder) {
            fs.copyFileSync(path.join(placeholderTexturePath, placeholder), path.join(configDir, "projects", projectName, "image", "texture", placeholder));
          }); // Copy the mod source code format to the project folder location

          fse.copySync(path.join(app.getAppPath(), "..", "src", "assets", "project"), path.join(configDir, "projects", projectName, "source"), {
            recursive: true
          });
          modPath = path.join(configDir, "projects", projectName, "source", "src", "main", "java", "net", "mcmm", projectName);
          fs.mkdir(modPath, {
            recursive: true
          }, function (e) {
            console.log(e);
          });
          fse.copySync(path.join(app.getAppPath(), "..", "src", "assets", "mod_files"), modPath, {
            recursive: true
          }); // Create a folder at src/main/resources/assets/project_name

          resourceAssetsPath = path.join(configDir, "projects", projectName, "source", "src", "main", "resources", "assets", projectName);
          fs.mkdir(resourceAssetsPath, {
            recursive: true
          }, function (e) {
            console.log(e);
          });
          fse.copySync(path.join(app.getAppPath(), "..", "src", "assets", "resource_assets"), resourceAssetsPath, {
            recursive: true
          }); // Create a folder at src/main/resources/assets/project_name/data

          resourceDataPath = path.join(configDir, "projects", projectName, "source", "src", "main", "resources", "data", projectName);
          fs.mkdir(resourceDataPath, {
            recursive: true
          }, function (e) {
            console.log(e);
          });
          fse.copySync(path.join(app.getAppPath(), "..", "src", "assets", "resource_data"), resourceDataPath, {
            recursive: true
          }); // Create a folder at src/main/resources/assets/project_name/data

          mcResourceDataPath = path.join(configDir, "projects", projectName, "source", "src", "main", "resources", "data", "minecraft");
          fs.mkdir(mcResourceDataPath, {
            recursive: true
          }, function (e) {
            console.log(e);
          });
          fse.copySync(path.join(app.getAppPath(), "..", "src", "assets", "resource_data_minecraft"), mcResourceDataPath, {
            recursive: true
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.initializeNewProjectData = function (projectName) {
  try {
    var newProjectData = {
      name: projectName,
      items: [],
      blocks: [],
      biomes: [],
      mobs: [],
      structures: [],
      paintings: [],
      trees: [],
      recipes: [],
      advancements: [],
      guis: [],
      tags: [],
      loot: [],
      tools: [],
      armor: [],
      crops: []
    };
    pushData(dataDb, newProjectData);
    pushData(nodesDb, newProjectData);
  } catch (error) {
    console.log(error);
  }
};

module.exports.getProjects = function () {
  try {
    return db.get("projects");
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports.writeProjects = function (projects) {
  try {
    db.set("projects", projects);
  } catch (error) {
    console.log(error);
  }
};

module.exports.addProject = function (_ref3) {
  var projectData = _ref3.projectData,
      projectNodes = _ref3.projectNodes;
  pushData(dataDb, projectData);
  pushData(nodesDb, projectNodes);
};

module.exports.getProjectDataByName = function (projectName) {
  try {
    var data = dataDb.get("data");
    return data.find(function (project) {
      return project.name === projectName;
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports.getProjectNodesByName = function (projectName) {
  try {
    var data = nodesDb.get("data");
    return data.find(function (project) {
      return project.name === projectName;
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports.removeProjectDataByName = function (projectName) {
  try {
    removeItemByProjectName(dataDb, projectName);
    removeItemByProjectName(nodesDb, projectName);
  } catch (error) {
    console.log(error);
  }
};

module.exports.getProjectNodesByName = function (projectName) {
  try {
    var data = nodesDb.get("data");
    return data.find(function (d) {
      return d.name === projectName;
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports.addModElement = function (args) {
  try {
    var projectName = args.projectName,
        node = args.node;
    saveModElementToDb(dataDb, projectName, node.type, node);
    saveModElementToDb(nodesDb, projectName, node.type, {
      name: node.name,
      nodes: {}
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.UpdateModElementDataField = function (args) {
  try {
    var projectName = args.projectName,
        arrayName = args.arrayName,
        entryName = args.entryName,
        data = args.data;
    updateModElementDataFieldInDb(dataDb, projectName, arrayName, entryName, data);
    return Promise.resolve({
      status: STATUSES.SUCCESS,
      message: "Element Data Field updated successfully"
    });
  } catch (error) {
    return Promise.resolve({
      status: STATUSES.ERROR,
      message: error.message
    });
  }
};

module.exports.updateModElement = function (args) {
  try {
    var projectName = args.projectName,
        arrayName = args.arrayName,
        oldEntryName = args.oldEntryName,
        newEntryName = args.newEntryName;
    updateModElementNameInDb(dataDb, projectName, arrayName, oldEntryName, newEntryName);
    return Promise.resolve({
      status: STATUSES.SUCCESS,
      message: "Element updated successfully"
    });
  } catch (error) {
    return Promise.resolve({
      status: STATUSES.ERROR,
      message: error.message
    });
  }
};

module.exports.removeModElement = function (args) {
  try {
    var projectName = args.projectName,
        arrayName = args.arrayName,
        entryName = args.entryName;
    removeModElementFromDb(dataDb, projectName, arrayName, entryName);
    removeModElementFromDb(nodesDb, projectName, arrayName, entryName);
    return Promise.resolve({
      status: STATUSES.SUCCESS,
      message: "Element removed successfully"
    });
  } catch (error) {
    return Promise.resolve({
      status: STATUSES.ERROR,
      message: error.message
    });
  }
};

module.exports.updateProjectArrayEntry = function (args) {
  try {
    var projectName = args.projectName,
        arrayName = args.arrayName,
        entryName = args.entryName,
        data = args.data;
    updateModElementInDb(dataDb, projectName, arrayName, entryName, data);
    return Promise.resolve({
      status: STATUSES.SUCCESS,
      message: "Element updated successfully"
    });
  } catch (error) {
    return Promise.resolve({
      status: STATUSES.ERROR,
      message: error.message
    });
  }
};

module.exports.updateNodesArrayEntry = function (args) {
  try {
    var projectName = args.projectName,
        arrayName = args.arrayName,
        entryName = args.entryName,
        data = args.data;
    updateNodesInDb(nodesDb, projectName, arrayName, entryName, data);
    return Promise.resolve({
      status: STATUSES.SUCCESS,
      message: "Element nodes updated successfully"
    });
  } catch (error) {
    console.log(error);
    return Promise.resolve({
      status: STATUSES.ERROR,
      message: error.message
    });
  }
};

module.exports.getNodesArrayEntry = function (args) {
  try {
    var projectName = args.projectName,
        arrayName = args.arrayName,
        entryName = args.entryName;
    var nodes = getModElementFromDb(nodesDb, projectName, arrayName, entryName);
    console.log(nodes);
    return nodes || {};
  } catch (error) {
    if (error instanceof DbError) {
      return {
        error: error.message
      };
    }

    return {
      error: error
    };
  }
};