const electron = require("electron");
const { dialog } = require("electron");
const path = require("path");
const fs = require("fs");
let configDir = (electron.app || electron.remote.app).getPath("userData");

module.exports.getTextures = (projectName) => {
    let textureConfigPath = path.join(
        configDir,
        "projects",
        projectName,
        "image",
        "texture"
    );
    if (fs.existsSync(textureConfigPath)) {
        console.log("texture folder exists");
    } else {
        console.log("texture folder doesn't exist");
        fs.mkdir(textureConfigPath, { recursive: true }, (e) => {
            console.log(e);
        });
    }
    let textures = [];
    const files = fs.readdirSync(textureConfigPath);
    files.forEach((file) => {
        // TODO make each file call async and await them all
        textures.push({
            src: base64_encode(path.join(textureConfigPath, file)),
            name: file,
        });
    });
    return textures;
};

module.exports.openFilePicker = async (projectName) => {
    let textureConfigPath = path.join(
        configDir,
        "projects",
        projectName,
        "image",
        "texture"
    );
    if (fs.existsSync(textureConfigPath)) {
        console.log("texture folder exists");
    } else {
        console.log("texture folder doesn't exist");
        fs.mkdir(textureConfigPath, { recursive: true }, (e) => {
            console.log(e);
        });
    }

    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile", "multiSelections"],
        filters: [{ name: "Images", extensions: ['jpg', 'jpeg', 'png', 'gif'] }],
    });

    if (canceled) {
        return "no file selected";
    }

    filePaths.forEach((file) => {
        const baseName = path.basename(file);
        const fileName = baseName.replace(/\s+/g, '_').toLowerCase();
        fs.copyFileSync(file, path.join(textureConfigPath, fileName));
    });

    return filePaths;
};

function base64_encode(file) {
    return "data:image/gif;base64," + fs.readFileSync(file, "base64");
}
