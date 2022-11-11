const { dialog, shell } = require("electron");
const fs = require("fs");
const { parse } = require('csv-parse');
const { app, remote } = require("electron");
const path = require("path");
const AdmZip = require("adm-zip");
const {
  getProjectDataByName,
  getProjectNodesByName,
  addProject,
  writeProjects,
  getProjects,
  initializeProjectDirectories,
} = require("./DatabaseUtility");

module.exports.saveFile = async ({ dialogTitle, defaultPath, content }) => {
  const { filePath } = await dialog.showSaveDialog({
    title: dialogTitle,
    defaultPath,
    properties: ["createDirectory", "showOverwriteConfirmation"],
  });

  if (!filePath) return Promise.resolve({ status: "canceled" });

  const promise = new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (error) => {
      if (error) {
        reject({
          status: "error",
          message: error,
        });
      } else {
        resolve({
          status: "success",
          message: "File saved successfully",
        });
      }
    });
  });

  return promise;
};

module.exports.openFolder = async (pathSegments = []) => {
  const appFolder = (app || remote.app).getPath("userData");
  const targetFolder = path.join(appFolder, ...pathSegments);
  return shell.openPath(targetFolder);
};

module.exports.openExternalLink = async (url = '') => {
  if (url === '') return;
  return shell.openExternal(url);
};

module.exports.exportProject = async (projectName) => {
  const appFolder = (app || remote.app).getPath("userData");
  const projectContentFolder = path.join(appFolder, "projects", projectName);

  const projectConfig = getProjects().find((p) => p.name === projectName);
  const projectData = getProjectDataByName(projectName);
  const projectNodes = getProjectNodesByName(projectName);

  const { filePath } = await dialog.showSaveDialog({
    title: "Save project",
    defaultPath: `mmm-app-${projectName}.zip`,
    filters: [{ name: "Zip archives only", extensions: ["zip"] }],
    properties: ["createDirectory", "showOverwriteConfirmation"],
  });

  if (!filePath) {
    return Promise.resolve({ status: "canceled" });
  }

  return new Promise((resolve) => {
    try {
      const zip = new AdmZip();

      zip.addLocalFolder(projectContentFolder, `projects/${projectName}`);

      zip.addFile(
        "ProjectData.json",
        Buffer.from(JSON.stringify(projectData), "utf8")
      );

      zip.addFile(
        "ProjectNodes.json",
        Buffer.from(JSON.stringify(projectNodes), "utf8")
      );

      zip.addFile(
        "ProjectDetails.json",
        Buffer.from(JSON.stringify(projectConfig), "utf-8")
      );

      zip.writeZip(filePath, (error) => {
        if (error) {
          throw error;
        }

        resolve({
          status: "success",
          message: "Project exported successfully",
          filePath,
        });
      });
    } catch (error) {
      resolve({ status: "error", message: error.message });
    }
  });
};

module.exports.exportProjectData = async (projectName) => {
  const projectData = getProjectDataByName(projectName);
  const { filePath } = await dialog.showSaveDialog({
    title: "Save project",
    defaultPath: `ProjectData.json`,
    filters: [{ name: "JSON files only", extensions: ["json"] }],
    properties: ["createDirectory", "showOverwriteConfirmation"],
  });

  if (!filePath) return Promise.resolve({ status: "canceled" });

  const promise = new Promise((resolve, reject) => {
    fs.writeFile(filePath, Buffer.from(JSON.stringify(projectData), "utf8"), (error) => {
      if (error) {
        reject({
          status: "error",
          message: error,
        });
      } else {
        resolve({
          status: "success",
          message: "File saved successfully",
        });
      }
    });
  });

  return promise;
};

module.exports.importProject = async () => {
  const appFolder = (app || remote.app).getPath("userData");

  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Zip archives only", extensions: ["zip"] }],
  });

  if (canceled) {
    return Promise.resolve({ status: "canceled" });
  }

  return new Promise((resolve) => {
    try {
      const file = filePaths[0];

      const zip = new AdmZip(file);

      const zipEntries = zip.getEntries();

      const configEntries = ["ProjectDetails.json", "ProjectData.json", "ProjectNodes.json"];

      const projectDetailsFile = zip.getEntry(configEntries[0]);
      const projectDataFile = zip.getEntry(configEntries[1]);
      const projectNodesFile = zip.getEntry(configEntries[2]);

      if (!projectDataFile || !projectNodesFile || !projectDetailsFile) {
        throw new Error("Format not compatible");
      }

      const projectDetails = JSON.parse(projectDetailsFile.getData().toString());
      const projectData = JSON.parse(projectDataFile.getData().toString());
      const projectNodes = JSON.parse(projectNodesFile.getData().toString());

      if (getProjectDataByName(projectData.name)) {
        throw new Error(`Project ${projectData.name} exists`);
      }

      addProject({ projectData, projectNodes });
      const projects = getProjects()
      writeProjects([...projects, projectDetails]);

      const projectFiles = zipEntries.filter(
        (entry) => !configEntries.includes(entry.name)
      );

      initializeProjectDirectories(projectData.name);

      projectFiles.forEach(function(entry) {
        zip.extractEntryTo(entry, appFolder, true, true);
      });

      resolve({ status: "success", message: "Project imported successfully" });
    } catch (error) {
      resolve({ status: "error", message: error.message });
    }
  });
};

module.exports.getTooltipValue = async () => {
  let data= [];
  let csvPath = path.join(__dirname, '../src/assets/data/tooltip.csv');

  await new Promise ((resolve,reject)=>{        
    fs.createReadStream(csvPath, 'utf-8')
    .pipe(parse({ delimiter: ',', skip_empty_lines: true, columns: true, bom: true }))
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', () => {
      resolve();
    });
  });
  return data;
}
