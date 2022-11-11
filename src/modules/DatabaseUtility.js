const JSONdb = require("simple-json-db");
const { app, remote } = require("electron");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const { STATUSES } = require("./constants");

const configDir = (app || remote.app).getPath("userData");
const jsonDbConfig = {
  jsonSpaces: 2,
};

let db;
let dataDb;
let nodesDb;

class DbError extends Error {
  static getDetails(details) {
    return Object.entries(details)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n\t");
  }

  constructor(message, details = {}) {
    super(`${message}. Details: \n\t${DbError.getDetails(details)}`);
    this.name = "DatabaseError";
  }
}

/**
 * Given a database and a new piece of data, add the new data to the database
 * @param db - The database object.
 * @param newData - The data you want to push to the database.
 * @param [key=data] - The key to store the data under.
 */
const pushData = (db, newData, key = "data") => {
  db.set(key, [...db.get(key), newData]);
};

/**
 * Add a new element to an array of elements in a project
 * @param db - The database object.
 * @param projectName - The name of the project you want to add the element to.
 * @param type - The type of element you want to add.
 * @param content - The content of the mod.
 * @param [key=data] - The key of the data you want to update.
 */
const saveModElementToDb = (db, projectName, type, content, key = "data") => {
  const data = db.get(key);

  const updatedData = data.map((project) => {
    if (project.name === projectName) {
      return {
        ...project,
        [type]: [...project[type], content],
      };
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
const updateModElementDataFieldInDb = (db, projectName, type, entryName, content, key = "data") => {
  const data = db.get(key);
  const updatedData = data.map((project) => {
    if (project.name === projectName) {
      return {
        ...project,
        [type]: project[type].map((entry) => {
          if (entry.name === entryName) {
            const { datafield, datavalue } = content;
            entry.data[datafield] = datavalue;
            return entry;
          }
          return entry;
        }),
      };
    }
    return project;
  });
  db.set(key, updatedData);
}
/**
 * Update the mod element in the database
 * @param db - the database object
 * @param projectName - The name of the project you want to update.
 * @param type - The type of element you want to update.
 * @param entryName - The name of the entry you want to update.
 * @param content - The content of the element you want to update.
 * @param [key=data] - The key in the database where the data is stored.
 */
const updateModElementInDb = (
  db,
  projectName,
  type,
  entryName,
  content,
  key = "data"
) => {
  const data = db.get(key);

  const updatedData = data.map((project) => {
    if (project.name === projectName) {
      return {
        ...project,
        [type]: project[type].map((entry) => {
          if (entry.name === entryName) {
            return content;
          }
          return entry;
        }),
      };
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
 const updateModElementNameInDb = (
  db,
  projectName,
  type,
  oldEntryName,
  newEntryName,
  key = "data"
) => {
  const data = db.get(key);
  console.log("data:", data);
  // const updatedData = data.map((project) => {
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
const updateNodesInDb = (
  db,
  projectName,
  type,
  entryName,
  content,
  key = "data"
) => {
  const data = db.get(key);
  console.log(data);

  const updatedData = data.map((project) => {
    if (project.name === projectName) {
      return {
        ...project,
        [type]: project[type].map((entry) => {
          if (entry.name === entryName) {
            return { name: entry.name, nodes: content };
          }
          return entry;
        }),
      };
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
const getModElementFromDb = (
  db,
  projectName,
  type,
  entryName,
  key = "data"
) => {
  const data = db.get(key);
  const project = data.find((project) => project.name === projectName);

  return project
    ? project[type].find((element) => element.name === entryName)
    : null;
};

/**
 * Remove a mod element from the database
 * @param db - The database object.
 * @param projectName - The name of the project you want to remove the element from.
 * @param type - The type of element to remove.
 * @param entryName - The name of the entry to be removed.
 * @param [key=data] - The key in the database where the data is stored.
 */
const removeModElementFromDb = (
  db,
  projectName,
  type,
  entryName,
  key = "data"
) => {
  const data = db.get(key);

  const updatedData = data.map((project) => {
    if (project.name === projectName) {
      return {
        ...project,
        [type]: project[type].filter((item) => item.name !== entryName),
      };
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
const removeItemByProjectName = (db, projectName, key = "data") => {
  const data = db.get(key);
  const updatedData = data.filter((project) => project.name !== projectName);
  db.set(key, updatedData);
};

module.exports.initializeDatabase = () => {
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

module.exports.initializeProjectDirectories = async (projectName) => {
  let projectPaths = [
    path.join(configDir, "projects", projectName, "image", "texture"),
  ];
  projectPaths.forEach((path) => {
    fs.mkdirSync(path, { recursive: true });
  });

  let placeholderTexturePath = path.join(app.getAppPath(), "..", "src", "assets", "img", "placeholders");
  const placeholders = fs.readdirSync(placeholderTexturePath);
  // Copy the placeholder textures to the project's texture folder
  placeholders.forEach(placeholder => {
    fs.copyFileSync(
      path.join(placeholderTexturePath, placeholder),
      path.join(configDir, "projects", projectName, "image", "texture", placeholder)
    );
  });

  // Copy the mod source code format to the project folder location
  fse.copySync(
    path.join(app.getAppPath(), "..", "src", "assets", "project"),
    path.join(configDir, "projects", projectName, "source"),
    { recursive: true }
  );

  let modPath = path.join(
    configDir,
    "projects",
    projectName,
    "source",
    "src",
    "main",
    "java",
    "net",
    "mcmm",
    projectName
  );
  fs.mkdir(modPath, { recursive: true }, (e) => {
    console.log(e);
  });
  fse.copySync(
    path.join(app.getAppPath(), "..", "src", "assets", "mod_files"),
    modPath,
    { recursive: true }
  );

  // Create a folder at src/main/resources/assets/project_name
  let resourceAssetsPath = path.join(
    configDir,
    "projects",
    projectName,
    "source",
    "src",
    "main",
    "resources",
    "assets",
    projectName
  );
  fs.mkdir(resourceAssetsPath, { recursive: true }, (e) => {
    console.log(e);
  });
  fse.copySync(
    path.join(app.getAppPath(), "..", "src", "assets", "resource_assets"),
    resourceAssetsPath,
    { recursive: true }
  );

  // Create a folder at src/main/resources/assets/project_name/data
  let resourceDataPath = path.join(
    configDir,
    "projects",
    projectName,
    "source",
    "src",
    "main",
    "resources",
    "data",
    projectName
  );
  fs.mkdir(resourceDataPath, { recursive: true }, (e) => {
    console.log(e);
  });
  fse.copySync(
    path.join(app.getAppPath(), "..", "src", "assets", "resource_data"),
    resourceDataPath,
    { recursive: true }
  );

  // Create a folder at src/main/resources/assets/project_name/data
  let mcResourceDataPath = path.join(
    configDir,
    "projects",
    projectName,
    "source",
    "src",
    "main",
    "resources",
    "data",
    "minecraft"
  );
  fs.mkdir(mcResourceDataPath, { recursive: true }, (e) => {
    console.log(e);
  });
  fse.copySync(
    path.join(
      app.getAppPath(),
      "..",
      "src",
      "assets",
      "resource_data_minecraft"
    ),
    mcResourceDataPath,
    { recursive: true }
  );
};

module.exports.initializeNewProjectData = (projectName) => {
  try {
    let newProjectData = {
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

module.exports.getProjects = () => {
  try {
    return db.get("projects");
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports.writeProjects = (projects) => {
  try {
    db.set("projects", projects);
  } catch (error) {
    console.log(error);
  }
};

module.exports.addProject = ({ projectData, projectNodes }) => {
  pushData(dataDb, projectData);
  pushData(nodesDb, projectNodes);
};

module.exports.getProjectDataByName = (projectName) => {
  try {
    const data = dataDb.get("data");
    return data.find((project) => project.name === projectName);
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports.getProjectNodesByName = (projectName) => {
  try {
    const data = nodesDb.get("data");
    return data.find((project) => project.name === projectName);
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports.removeProjectDataByName = (projectName) => {
  try {
    removeItemByProjectName(dataDb, projectName);
    removeItemByProjectName(nodesDb, projectName);
  } catch (error) {
    console.log(error);
  }
};

module.exports.getProjectNodesByName = (projectName) => {
  try {
    const data = nodesDb.get("data");
    return data.find((d) => d.name === projectName);
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports.addModElement = (args) => {
  try {
    const { projectName, node } = args;
    saveModElementToDb(dataDb, projectName, node.type, node);
    saveModElementToDb(nodesDb, projectName, node.type, {
      name: node.name,
      nodes: {},
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.UpdateModElementDataField = (args) => {
  try {
    const { projectName, arrayName, entryName, data } = args;
    updateModElementDataFieldInDb(dataDb, projectName, arrayName, entryName, data);
    return Promise.resolve({
      status: STATUSES.SUCCESS,
      message: "Element Data Field updated successfully",
    });
  } catch (error) {
    return Promise.resolve({ status: STATUSES.ERROR, message: error.message });
  }
}

module.exports.updateModElement = (args) => {
  try {
    const { projectName, arrayName, oldEntryName, newEntryName } = args;
    updateModElementNameInDb(dataDb, projectName, arrayName, oldEntryName, newEntryName);
    return Promise.resolve({
      status: STATUSES.SUCCESS,
      message: "Element updated successfully",
    });
  } catch (error) {
    return Promise.resolve({ status: STATUSES.ERROR, message: error.message });
  }
}
module.exports.removeModElement = (args) => {
  try {
    const { projectName, arrayName, entryName } = args;
    removeModElementFromDb(dataDb, projectName, arrayName, entryName);
    removeModElementFromDb(nodesDb, projectName, arrayName, entryName);
    return Promise.resolve({
      status: STATUSES.SUCCESS,
      message: "Element removed successfully",
    });
  } catch (error) {
    return Promise.resolve({ status: STATUSES.ERROR, message: error.message });
  }
};

module.exports.updateProjectArrayEntry = (args) => {
  try {
    const { projectName, arrayName, entryName, data } = args;
    updateModElementInDb(dataDb, projectName, arrayName, entryName, data);
    return Promise.resolve({
      status: STATUSES.SUCCESS,
      message: "Element updated successfully",
    });
  } catch (error) {
    return Promise.resolve({ status: STATUSES.ERROR, message: error.message });
  }
};

module.exports.updateNodesArrayEntry = (args) => {
  try {
    const { projectName, arrayName, entryName, data } = args;
    updateNodesInDb(nodesDb, projectName, arrayName, entryName, data);
    return Promise.resolve({
      status: STATUSES.SUCCESS,
      message: "Element nodes updated successfully",
    });
  } catch (error) {
    console.log(error);
    return Promise.resolve({ status: STATUSES.ERROR, message: error.message });
  }
};

module.exports.getNodesArrayEntry = (args) => {
  try {
    const { projectName, arrayName, entryName } = args;
    const nodes = getModElementFromDb(
      nodesDb,
      projectName,
      arrayName,
      entryName
    );
    console.log(nodes);
    return nodes || {};
  } catch (error) {
    if (error instanceof DbError) {
      return { error: error.message };
    }
    return { error: error };
  }
};
