import { STATUSES } from '../constants';

const jsrender = require('jsrender');
const fs = require('fs');
const fse = require('fs-extra')
const path = require("path");
const electron = require("electron");
let configDir = (electron.app || electron.remote.app).getPath("userData");
let appDir = electron.app.getAppPath();
appDir = path.resolve(appDir, "..") + "/";
const {
    initializeProjectDirectories,
  } = require("../DatabaseUtility");

export class Templator {
    constructor(projectData) {
        this.projectData = projectData;
        this.projectName = projectData.name;

        // This is easy to make configurable later
        this.packageName = "net.mcmm." + projectData.name;
        this.modClass = "GeneratedMod";
        this.vendorName = "MC Mod Maker";
        this.en_us_json = {}; // Add key/value pairs to the Language json file and write when all mod elements have been written
        this.vanilla_tags = {};

        this.textureConfigPath = path.join(configDir, "projects", this.projectName, "image", "texture");
        this.modelConfigPath = path.join(configDir, "projects", this.projectName, "model");
        this.resourcePath = path.join(configDir, "projects", this.projectName, "source", "src", "main", "resources");

        this.templateData = {
            package: this.packageName,
            modclass: this.modClass,
            modid: this.projectName,
            vendor: this.vendorName,
            projectdata: this.projectData
        }
    }

    async run() {
        return [
            await this.templateMod(),
            await this.templateItems(),
            await this.templateArmor(),
            await this.templateTools(),
            await this.templateBlocks(),
            await this.templateRecipes(),
            await this.templatePaintings(),
            await this.templateCrops(),
        ].flat();
    }

    templateMod() {
        const templateMods = [
            this.render("mod.java", this.templateData, path.join("src", "main", "java", "net", "mcmm", this.projectName, "GeneratedMod.java")),
            this.render("modarmormaterials.java", this.templateData, path.join("src", "main", "java", "net", "mcmm", this.projectName, "item", "ModArmorMaterials.java")),
            this.render("moditems.java", this.templateData, path.join("src", "main", "java", "net", "mcmm", this.projectName, "item", "ModItems.java")), // Also pass list of items so they can all be added to the map
            this.render("modblocks.java", this.templateData, path.join("src", "main", "java", "net", "mcmm", this.projectName, "block", "ModBlocks.java")),
            this.render("modpaintings.java", this.templateData, path.join("src", "main", "java", "net", "mcmm", this.projectName, "painting", "ModPaintings.java")),
            this.render("mods.toml", this.templateData, path.join("src", "main", "resources", "META-INF", "mods.toml")),
            this.render("pack.mcmeta", this.templateData, path.join("src", "main", "resources", "pack.mcmeta")),
            this.render("build.gradle", this.templateData, "build.gradle"),
        ];

        return Promise.allSettled(templateMods);
    }

    getErrorObject(error, method) {
        return error.instanceName ? error : {
            instanceName: this.constructor.name,
            method,
            error
        }
    }

    templateItems() {
        const dataPromises = this.projectData.items.map(async (item) => {
            if (!this.validateElementData(item)) {
                return Promise.reject(this.getErrorObject("Invalidate element data for " + item.name, "templateItems"));
            }
            try {
                
                let itemRegistryName = item.data.registryName;
                item.data.registryname = itemRegistryName;
                await this.renderElement("ItemModel", item, path.join("resources", "assets", this.projectName, "models", "item", itemRegistryName + ".json"));
                const itemTexture = path.join(this.textureConfigPath, item.data.itemTexture.name);
                fs.copyFileSync(itemTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "item", item.data.itemTexture.name));
                this.en_us_json["item." + this.projectName + "." + itemRegistryName] = item.data.inGameName;
                if (item.data.tags.length > 0) {
                    for (const tag of item.data.tags) {
                        this.addToVanillaTag(item, tag, "items");
                    }
                }
                this.templateData.data = item.data;
                let templateData = JSON.parse(JSON.stringify(this.templateData));
                console.log(templateData)
                await this.render("customitem.java", templateData, path.join("src", "main", "java", "net", "mcmm", this.projectName, "item", itemRegistryName + "Item.java"));
                return Promise.resolve(true);
            } catch (error) {
                return Promise.reject(this.getErrorObject(error, "templateItems"));
            }
        });

        return Promise.allSettled([...dataPromises, this.writeLanguageFile()]);
    }

    templateTools() {
        const dataPromises = this.projectData.tools.map(async (tool) => {
            try {
                await this.renderElement("ToolModel", tool, path.join("resources", "assets", this.projectName, "models", "item", tool.data.registryName + ".json"));
                let toolTexture = path.join(this.textureConfigPath, tool.data.itemTexture.name);
                fs.copyFileSync(toolTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "item", tool.data.itemTexture.name));
                this.en_us_json["item." + this.projectName + "." + tool.data.registryName] = tool.data.inGameName;
                return Promise.resolve(true);
            } catch (error) {
                return Promise.reject(this.getErrorObject(error, "templateTools"));
            }
        });

        return Promise.allSettled([...dataPromises, this.writeLanguageFile()]);
    }

    async templateArmor() {
        const dataPromises = this.projectData.armor.map(async (armor) => {
            try {
                const armorRegistryName = armor.data.registryName;
                await this.renderElement("HelmetModel", armor, path.join("resources", "assets", this.projectName, "models", "item", armorRegistryName + "_helmet" + ".json"));
                await this.renderElement("ChestplateModel", armor, path.join("resources", "assets", this.projectName, "models", "item", armorRegistryName + "_chestplate" + ".json"));
                await this.renderElement("LeggingModel", armor, path.join("resources", "assets", this.projectName, "models", "item", armorRegistryName + "_leggings" + ".json"));
                await this.renderElement("BootModel", armor, path.join("resources", "assets", this.projectName, "models", "item", armorRegistryName + "_boots" + ".json"));
                let helmetTexture = path.join(this.textureConfigPath, armor.data.helmetTexture.name);
                fs.copyFileSync(helmetTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "item", armorRegistryName + "_helmet" + ".png"));
                let chestplateTexture = path.join(this.textureConfigPath, armor.data.chestplateTexture.name);
                fs.copyFileSync(chestplateTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "item", armorRegistryName + "_chestplate" + ".png"));
                let leggingTexture = path.join(this.textureConfigPath, armor.data.leggingTexture.name);
                fs.copyFileSync(leggingTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "item", armorRegistryName + "_leggings" + ".png"));
                let bootTexture = path.join(this.textureConfigPath, armor.data.bootTexture.name);
                fs.copyFileSync(bootTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "item", armorRegistryName + "_boots" + ".png"));
                let layer1Texture = path.join(this.textureConfigPath, armor.data.layer1Texture.name);
                fs.copyFileSync(layer1Texture, path.join(this.resourcePath, "assets", this.projectName, "textures", "models", "armor", armorRegistryName + "_layer_1" + ".png"));
                let layer2Texture = path.join(this.textureConfigPath, armor.data.layer2Texture.name);
                fs.copyFileSync(layer2Texture, path.join(this.resourcePath, "assets", this.projectName, "textures", "models", "armor", armorRegistryName + "_layer_2" + ".png"));
                this.en_us_json["item." + this.projectName + "." + armor.data.registryName + "_helmet"] = armor.data.helmetInGameName;
                this.en_us_json["item." + this.projectName + "." + armor.data.registryName + "_chestplate"] = armor.data.chestplateInGameName;
                this.en_us_json["item." + this.projectName + "." + armor.data.registryName + "_leggings"] = armor.data.leggingsInGameName;
                this.en_us_json["item." + this.projectName + "." + armor.data.registryName + "_boots"] = armor.data.bootsInGameName;
                return Promise.resolve(true);
            } catch (error) {
                return Promise.reject(error);
            }
        });

        return Promise.allSettled([...dataPromises, this.writeLanguageFile()]);
    }

    async templateBlocks() {
        const dataPromises = this.projectData.blocks.map(async (block) => {
            if (!this.validateElementData(block)) {
                return Promise.reject(this.getErrorObject("Invalidate element data for " + block.name, "templateBlocks"));
            }
            try {
                let blockRegistryName = block.data.registryName;
                console.log(blockRegistryName)
                let templatorData = JSON.parse(JSON.stringify(this.templateData));   // deep copy to avoid race condition issues
                templatorData.data = block.data;

                await this.render("customblock.java", templatorData, path.join("src", "main", "java", "net", "mcmm", this.projectName, "block", blockRegistryName + "Block.java"));
                await this.renderElement("BlockState", block, path.join("resources", "assets", this.projectName, "blockstates", blockRegistryName + ".json"));
                await this.renderElement("BlockItemModel", block, path.join("resources", "assets", this.projectName, "models", "item", blockRegistryName + ".json"));

                if (block.data.customModel) {
                    // Copy model file and associated textures
                    let blockModel = path.join(this.modelConfigPath, block.data.customBlockModel);
                    fs.copyFileSync(blockModel, path.join(this.resourcePath, "assets", this.projectName, "models", "block", blockRegistryName + ".json"));
                    for (let i = 0; i < block.data.customTextures.length; i++) {
                        let blockTexture = path.join(this.textureConfigPath, block.data.customTextures[i].name);
                        fs.copyFileSync(blockTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "block", block.data.customTextures[i].name));
                    }
                }
                else if (block.data.blockType === "Cube C") {
                    await this.renderElement("BlockModel", block, path.join("resources", "assets", this.projectName, "models", "block", blockRegistryName + ".json"));
                    let blockTexture = path.join(this.textureConfigPath, block.data.cube1.name);
                    fs.copyFileSync(blockTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "block", block.data.cube1.name + ".png"));
                    blockTexture = path.join(this.textureConfigPath, block.data.cube2.name);
                    console.log(blockTexture)
                    fs.copyFileSync(blockTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "block", block.data.cube2.name + ".png"));
                }
                else if (block.data.blockType === "Cube SS") {
                    await this.renderElement("BlockModel", block, path.join("resources", "assets", this.projectName, "models", "block", blockRegistryName + ".json"));
                    let blockTexture;
                    for (let i = 1; i <= 6; i++) {
                        let cube = "cube" + i.toString();
                        blockTexture = path.join(this.textureConfigPath, block.data[cube].name);
                        fs.copyFileSync(blockTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "block", block.data[cube].name + ".png"));
                    }
                }
                else {
                    // Copy normal model file and texture
                    await this.renderElement("BlockModel", block, path.join("resources", "assets", this.projectName, "models", "block", blockRegistryName + ".json"));
                    let blockTexture = path.join(this.textureConfigPath, block.data.cube1.name);
                    fs.copyFileSync(blockTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "block", blockRegistryName + ".png"));
                }
                
                this.en_us_json["block." + this.projectName + "." + blockRegistryName] = block.data.inGameName;
                await this.writeLanguageFile();
                // Loot table
                if (block.data.lootTable) {
                    const lootTablePath = path.join(this.resourcePath, "data", this.projectName, "loot_tables", "blocks", blockRegistryName + ".json");
                    fs.writeFile(lootTablePath, JSON.stringify(JSON.parse(block.data.lootTable.json)), (error) => {
                        if (error) {
                            throw error;
                        }
                    });
                }
                return Promise.resolve(true);
            } catch (error) {
                return Promise.reject(this.getErrorObject(error, "templateBlocks"));
            }
        })

        return Promise.allSettled([...dataPromises, this.writeLanguageFile()]);
    }

    async templateRecipes() {
        return Promise.allSettled(this.projectData.recipes.map(async (recipe) => {
            try {
                const recipeRegistryName = recipe.name.replace(/ /g, "_").toLowerCase();
                recipe.data.registryName = recipeRegistryName;
                await this.renderElement("Recipe", recipe, path.join("resources", "data", this.projectName, "recipes", recipeRegistryName + ".json"));
                return Promise.resolve(true);
            } catch (error) {
                return Promise.reject(this.getErrorObject(error, "templateRecipes"));
            }
        }));
    }

    templatePaintings() {
        return Promise.allSettled(
            this.projectData.paintings.map(painting => {
                try {
                    let paintingsRegistryName = painting.name.replace(/ /g, "_").toLowerCase();
                    painting.data.registryname = paintingsRegistryName;
                    let paintingTexture = path.join(this.textureConfigPath, painting.data.texture.name);
                    fs.copyFileSync(paintingTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "painting", paintingsRegistryName + ".png"));
                    return Promise.resolve(true);
                } catch (error) {
                    return Promise.reject(this.getErrorObject(error, "templatePaintings"));
                }
            })
        )
    }

    async templateCrops() {
        const dataPromises = this.projectData.crops.map(async (crop) => {
            try {
                let cropRegistryName = crop.data.inGameName.replace(/ /g, "_").toLowerCase();
                crop.data.registryName = cropRegistryName;
                let templatorData = JSON.parse(JSON.stringify(this.templateData));   // deep copy to avoid race condition issues
                templatorData.data = crop.data;
                await this.render("customcrop.java", templatorData, path.join("src", "main", "java", "net", "mcmm", this.projectName, "block", cropRegistryName + "CropBlock.java"));
                await this.renderElement("CropBlockState", crop, path.join("resources", "assets", this.projectName, "blockstates", cropRegistryName + ".json"));
                crop.data.stages.forEach(async (stage) => {
                    let stageTexture = stage.texture.name;
                    let cropBlockModelData = {
                        data: {stageTexture: stageTexture}
                    }
                    await this.renderElement("CropBlockModel", cropBlockModelData, path.join("resources", "assets", this.projectName, "models", "block", stageTexture + ".json"));
                    let cropTexture = path.join(this.textureConfigPath, stageTexture);
                    fs.copyFileSync(cropTexture, path.join(this.resourcePath, "assets", this.projectName, "textures", "block", stageTexture));
                });
                return Promise.resolve(true);
            } catch (error) {
                return Promise.reject(this.getErrorObject(error, "templateCrops"));
            }
        });

        return Promise.allSettled([...dataPromises, this.writeLanguageFile()]);
    }

    render(templateName, dataModel, copyPath) {
        const _this = this;
        let pn = this.projectName;
        let cd = configDir;
        let resourcePath = path.join(cd, "projects", pn, "source", copyPath);
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(appDir,"src","modules","template","templates","mod", templateName + ".jsr"), "utf8", function(readFileError, data) {
                if (readFileError) {
                    reject(_this.getErrorObject(readFileError, "render/readFile"));
                    return;
                }
                const template = jsrender.templates(data);
                const rendered = template.render(dataModel);
    
                fs.writeFile(resourcePath, rendered, (writeFileError) => {
                    if (writeFileError) {
                        reject(_this.getErrorObject(writeFileError, "render/writeFile"));
                    } else {
                        resolve(true);
                    }
                });
            });
        })
    }

    async renderElement(templateName, dataModel, copyPath) {
        const _this = this;
        const pn = this.projectName;
        const cd = configDir;

        return new Promise((resolve, reject) => {
            const resourcePath = path.join(cd, "projects", pn, "source", "src", "main", copyPath);
            fs.readFile(path.join(appDir,"src","modules","template","templates", templateName + ".jsr"), "utf8", async function(readFileError, data) {
                let template = jsrender.templates(data);
                dataModel.data.projectName = pn;
                dataModel.data.modid = pn;

                if (readFileError) {
                    reject(_this.getErrorObject(readFileError, "renderElement/readFile"));
                    return;
                }
            
                const rendered = await template.render({data: dataModel.data});
                fs.writeFile(resourcePath, rendered, (error) => {
                    if (error) {
                        reject(_this.getErrorObject(error, "renderElement/writeFile"));
                    }
                    resolve(true);
                });
            });
        })
    }

    writeLanguageFile() {
        const _this = this;
        return new Promise((resolve, reject) => {
            console.log(_this.en_us_json)
            let langFilePath = path.join(_this.resourcePath, "assets", _this.projectName, "lang", "en_us.json");
            fs.writeFile(langFilePath, JSON.stringify(_this.en_us_json), (error) => {
                if (error) {
                    reject(_this.getErrorObject(error, "writeLanguageFile"));
                    return;
                }
                resolve(true);
            });
        })
    }

    addToVanillaTag(data, tag, tagType) {
        if (!this.vanilla_tags[tagType]) {
            this.vanilla_tags[tagType] = {};
        }
        if (!this.vanilla_tags[tagType][tag]) {
            this.vanilla_tags[tagType][tag] = {
                "replace": false,
                "values": [

                ]
            }
        }
        this.vanilla_tags[tagType][tag].values.push(this.projectName + ":" + data.data.registryName);
        this.writeVanillaTagsFile(tagType, tag);
    }

    writeVanillaTagsFile(tagType, tag) {
        let tagFilePath = path.join(this.resourcePath, "data", "minecraft", "tags", tagType, tag + ".json");
        try {
            fs.writeFile(tagFilePath, JSON.stringify(this.vanilla_tags[tagType][tag]), (error) => {
                if (error) {
                    throw error
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    camalize(str) {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }

    async deleteOldFiles() {
        return new Promise((resolve, reject) => {
            try {
                const resourcePath = path.join(configDir, "projects", this.projectName, "source");
                fse.emptyDirSync(resourcePath);
                initializeProjectDirectories(this.projectName);
                resolve(true);
            } catch (error) {
                reject(error);
            }

        });
    }

    validateElementData(element) {
        if (!element.data.nodeDictionary) {
            return false;
        }
        return true;
    }

}