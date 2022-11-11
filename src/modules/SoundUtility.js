const electron = require("electron");
const { dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const configDir = (electron.app || electron.remote.app).getPath("userData");

const getFilePath = (projectName) => {
  const filePath = path.join(configDir, "projects", projectName, "sound");

  if (!fs.existsSync(filePath)) {
    fs.mkdir(filePath, { recursive: true }, (e) => {
      console.log(e);
    });
  }

  return filePath;
};

const base64_encode = (file, format) => {
  return `data:audio/${format};base64,${fs.readFileSync(file, "base64")}`;
};

module.exports.getSounds = (projectName) => {
  const filePath = getFilePath(projectName);
  const files = fs.readdirSync(filePath);
  return files.map((file) => ({
    name: file,
    src: base64_encode(path.join(filePath, file), "ogg"),
  }));
};

module.exports.openFilePicker = async (projectName) => {
  const configPath = getFilePath(projectName);
  let file, fileName;
  const response = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Audio", extensions: ["ogg"] }],
  });
  if (response.canceled) {
    file = "no file selected";
  } else {
    file = response.filePaths[0];
    fileName = path.basename(file);
    fs.copyFileSync(file, path.join(configPath, fileName));
  }
};
