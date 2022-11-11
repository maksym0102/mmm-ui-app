export const IPC_HANDLERS = {
  DATABASE: "database",
  IMAGE: "image",
  MODEL: "model",
  SOUND: "sound",
  FILE_SYSTEM: "fileSystem",
  RUN: "run",
  DEV_TOOLS: "devTools"
};

export const IPC_FUNCTIONS = {
  GET_PROJECTS: "getProjects",
  WRITE_PROJECTS: "writeProjects",
  GET_PROJECT_DATA_BY_NAME: "getProjectDataByName",
  UPDATE_PROJECT_ARRAY_ENTRY: "updateProjectArrayEntry",
  UPDATE_MOD_ELEMENT_DATA_FIELD: "UpdateModElementDataField",
  INITIALIZE_PROJECT_DIRECTORIES: "initializeProjectDirectories",
  INITIALIZE_NEW_PROJECT_DATA: "initializeNewProjectData",
  REMOVE_PROJECT_DATA_BY_NAME: "removeProjectDataByName",
  ADD_MOD_ELEMENT: "addModElement",
  UPDATE_MOD_ELEMENT: "updateModElement",
  REMOVE_MOD_ELEMENT: "removeModElement",
  UPDATE_NODES_ARRAY_ENTRY: "updateNodesArrayEntry",
  GET_NODES_ARRAY_ENTRY: "getNodesArrayEntry",
  GET_TEXTURES: "getTextures",
  OPEN_FILE_PICKER: "openFilePicker",
  GET_MODELS: "getModels",
  GET_SOUNDS: "getSounds",
  SAVE_FILE: "saveFile",
  OPEN_DIRECTORY: "openDirectory",
  OPEN_EXTERNAL_LINK: "openExternalLink",
  EXPORT_PROJECT: "exportProject",
  EXPORT_PROJECT_DATA: "exportProjectData",
  IMPORT_PROJECT: "importProject",
  GET_TOOLTIP_VALUE: 'getTooltipValue',
  BUILD_PROJECT: "buildProject",
  COMPILE_PROJECT: "compileProject",
  STOP_CLIENT: "stopClient",
  TOGGLE_DEV_TOOLS: "toggleDevTools"
};

export const ROOT_EVENTS = {
  DELETE_ELEMENT: "delete-element",
};

export const STATUSES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
};

export const NOTIFICATION_ACTIONS = {
  PUSH: "push-notification",
  BUILD_ERROR: "build-error",
  BUILD_STARTED: "build-started"
};

export const BROWSER_EVENTS = {
  READ_FILE: 'READ_FILE',
  WRITE_FILE: 'WRITE_FILE',
  BUILD: 'BUILD',
}

export const CONSOLE_MESSAGE_TYPES = {
  INFO: 'INFO',
  GAME: 'GAME',
}
