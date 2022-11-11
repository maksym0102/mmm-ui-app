import { ipcMain } from "electron";
import { IPC_HANDLERS, IPC_FUNCTIONS } from "./constants";
const databaseUtility = require("./DatabaseUtility");
const imageUtility = require("./ImageUtility");
const modelUtility = require("./ModelUtility");
const soundUtility = require("./SoundUtility");
const fileSystemUtility = require("./FileSystemUtility");
const runUtility = require("./RunUtility");
const devToolsUtility = require("./DevToolsUtility");


ipcMain.handle(IPC_HANDLERS.DATABASE, async (event, args) => {
    switch (args.func) {
        case IPC_FUNCTIONS.GET_PROJECTS:
            return databaseUtility.getProjects();
        case IPC_FUNCTIONS.WRITE_PROJECTS:
            databaseUtility.writeProjects(args.data);
            return null;
        case IPC_FUNCTIONS.GET_PROJECT_DATA_BY_NAME:
            return databaseUtility.getProjectDataByName(args.data);
        case IPC_FUNCTIONS.UPDATE_PROJECT_ARRAY_ENTRY:
            return databaseUtility.updateProjectArrayEntry(args.data)
        case IPC_FUNCTIONS.INITIALIZE_PROJECT_DIRECTORIES:
            databaseUtility.initializeProjectDirectories(args.data);
            break;
        case IPC_FUNCTIONS.INITIALIZE_NEW_PROJECT_DATA:
            databaseUtility.initializeNewProjectData(args.data);
            break;
        case IPC_FUNCTIONS.REMOVE_PROJECT_DATA_BY_NAME:
            databaseUtility.removeProjectDataByName(args.data);
            break;
        case IPC_FUNCTIONS.ADD_MOD_ELEMENT:
            databaseUtility.addModElement(args.data);
            break;
        case IPC_FUNCTIONS.UPDATE_MOD_ELEMENT:
            databaseUtility.updateModElement(args.data);
            break;
        case IPC_FUNCTIONS.UPDATE_MOD_ELEMENT_DATA_FIELD:
            databaseUtility.UpdateModElementDataField(args.data);
            break;
        case IPC_FUNCTIONS.REMOVE_MOD_ELEMENT:
            return databaseUtility.removeModElement(args.data);
        case IPC_FUNCTIONS.UPDATE_NODES_ARRAY_ENTRY:
            return databaseUtility.updateNodesArrayEntry(args.data);
        case IPC_FUNCTIONS.GET_NODES_ARRAY_ENTRY:
            return databaseUtility.getNodesArrayEntry(args.data);
        default:
            return null;
    }
});

ipcMain.handle(IPC_HANDLERS.IMAGE, async (event, args) => {
    switch (args.func) {
        case IPC_FUNCTIONS.GET_TEXTURES:
            return imageUtility.getTextures(args.data);
        case IPC_FUNCTIONS.OPEN_FILE_PICKER:
            return imageUtility.openFilePicker(args.data);
    }
});

ipcMain.handle(IPC_HANDLERS.MODEL, (event, args) => {
    const { func } = args;
    
    switch(func) {
        case IPC_FUNCTIONS.GET_MODELS:
            return modelUtility.getModels(args.data);
        case IPC_FUNCTIONS.OPEN_FILE_PICKER:
            return modelUtility.openFilePicker(args.data);
        default:
            break;
    }
});

ipcMain.handle(IPC_HANDLERS.SOUND, (event, args) => {
    const { func } = args;

    switch(func) {
        case IPC_FUNCTIONS.GET_SOUNDS:
            return soundUtility.getSounds(args.data);
        case IPC_FUNCTIONS.OPEN_FILE_PICKER:
            return soundUtility.openFilePicker(args.data);
        default:
            break;
    }
});

ipcMain.handle(IPC_HANDLERS.FILE_SYSTEM, (event, args) => {
    const { func, data } = args;
    switch (func) {
        case IPC_FUNCTIONS.SAVE_FILE:
            return fileSystemUtility.saveFile(data);
        case IPC_FUNCTIONS.OPEN_DIRECTORY: 
            return fileSystemUtility.openFolder(data);
        case IPC_FUNCTIONS.EXPORT_PROJECT:
            return fileSystemUtility.exportProject(data);
        case IPC_FUNCTIONS.EXPORT_PROJECT_DATA:
            return fileSystemUtility.exportProjectData(data);
        case IPC_FUNCTIONS.IMPORT_PROJECT:
            return fileSystemUtility.importProject();
        case IPC_FUNCTIONS.OPEN_EXTERNAL_LINK: 
            return fileSystemUtility.openExternalLink(data);
        case IPC_FUNCTIONS.GET_TOOLTIP_VALUE: 
            return fileSystemUtility.getTooltipValue();
        default:
            break;
    }
});

ipcMain.handle(IPC_HANDLERS.RUN, async (event, args) => {
    switch (args.func) {
        case IPC_FUNCTIONS.BUILD_PROJECT:
            return runUtility.buildProject(args.data);
        case IPC_FUNCTIONS.STOP_CLIENT:
            return runUtility.stopClient();
        case IPC_FUNCTIONS.COMPILE_PROJECT:
            return runUtility.compileProject(args.data);
        default:
            return null;
    }
});

ipcMain.handle(IPC_HANDLERS.DEV_TOOLS, async (event, args) => {
    switch (args.func) {
        case IPC_FUNCTIONS.TOGGLE_DEV_TOOLS:
            return devToolsUtility.toggleDevTools();
        default:
            return null;
    }
});


ipcMain.on( "setMyGlobalVariable", ( event, myGlobalVariableValue ) => {
    global.myGlobalVariable = myGlobalVariableValue;
});
