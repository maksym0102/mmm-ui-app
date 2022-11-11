<template>
    <v-container class="content-wrapper">
        <form-actions
            :name="name"
            :type="'Block'"
            @save="saveEl"
            @delete="deleteEl"
            @help="help"
        />
        <v-form v-model="valid" ref="blockForm" @submit.prevent="validate">
            <v-expansion-panels multiple v-model="panel">
                <v-expansion-panel>
                    <v-expansion-panel-header><h3>General</h3></v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-text-field
                                        dense
                                        filled
                                        label="In Game Name"
                                        v-model="blockObject.data.inGameName"
                                        color="accent"
                                        required
                                        :rules="nameRules"
                                    >
                                        <slot slot="append" name="tooltip">
                                            <Tooltip :text="tooltipTitle('BlockForm.InGameName')" />
                                        </slot>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-select
                                        :items="materials"
                                        label="Material"
                                        v-model="blockObject.data.material"
                                        hint="The block material"
                                        filled
                                        color="accent"
                                        item-color="accent"
                                    >
                                        <slot slot="append" name="tooltip">
                                            <Tooltip :text="tooltipTitle('BlockForm.Material')" />
                                        </slot>
                                    </v-select>
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-select
                                        :items="sounds"
                                        label="Sound"
                                        v-model="blockObject.data.sound"
                                        hint="The sound this block makes when walked upon"
                                        filled
                                        color="accent"
                                        item-color="accent"
                                    ></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <Slider
                                        v-model="blockObject.data.hardness"
                                        label="Hardness"
                                        min="0"
                                        step="0.1"
                                    >
                                        <template slot="tooltip-component">
                                            <component :is="tooltip_component" :text="tooltipTitle('BlockForm.Hardness')"></component>
                                        </template>
                                    </Slider>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <Slider
                                        v-model="blockObject.data.resistance"
                                        label="Explosion Resistance"
                                        min="0"
                                        step="0.1"
                                    >
                                        <template slot="tooltip-component">
                                            <component :is="tooltip_component" :text="tooltipTitle('BlockForm.ExplosionResistance')"></component>
                                        </template>
                                    </Slider>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <Slider
                                        v-model="blockObject.data.jumpFactor"
                                        label="Jump Factor"
                                        min="0"
                                        step="0.1"
                                    >
                                        <template slot="tooltip-component">
                                            <component :is="tooltip_component" :text="tooltipTitle('BlockForm.JumpFactor')"></component>
                                        </template>
                                    </Slider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <Slider
                                        v-model="blockObject.data.friction"
                                        label="Friction"
                                        min="0"
                                        step="0.1"
                                        max="1"
                                    >
                                        <template slot="tooltip-component">
                                            <component :is="tooltip_component" :text="tooltipTitle('BlockForm.Friction')"></component>
                                        </template>
                                    </Slider>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <Slider
                                        v-model="blockObject.data.speedFactor"
                                        label="Speed Factor"
                                        min="0"
                                        step="0.1"
                                    >
                                        <template slot="tooltip-component">
                                            <component :is="tooltip_component" :text="tooltipTitle('BlockForm.SpeedFactor')"></component>
                                        </template>
                                    </Slider>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-checkbox
                                        :label="'Has collision?'"
                                        v-model="blockObject.data.hasCollision"
                                        color="accent"
                                    ></v-checkbox>
                                </v-col>
                            </v-row>
                            <!-- <v-row>
                                <v-col cols="12" md="4">
                                    <v-checkbox
                                        :label="'Is valid spawn?'"
                                        v-model="blockObject.data.isValidSpawn"
                                        color="accent"
                                    ></v-checkbox>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-checkbox
                                        :label="'Is redstone conductor?'"
                                        v-model="
                                            blockObject.data.isRedstoneConductor
                                        "
                                        color="accent"
                                    ></v-checkbox>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-checkbox
                                        :label="'Is suffocating?'"
                                        v-model="blockObject.data.isSuffocating"
                                        color="accent"
                                    ></v-checkbox>
                                </v-col>
                            </v-row> -->
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-checkbox
                                        :label="
                                            'Requires correct tool for drop?'
                                        "
                                        color="accent"
                                        v-model="
                                            blockObject.data
                                                .requiresCorrectToolForDrops
                                        "
                                    ></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header><h3>Textures and Model</h3></v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-container>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-select
                                    :items="renderTypes"
                                    item-text="name"
                                    item-value="val"
                                    v-model="blockObject.data.renderType"
                                    label="Render Type"
                                    hint="Render type"
                                    filled
                                    color="accent"
                                    item-color="accent"
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                                <v-col cols="12" md="4">
                                    <v-checkbox
                                        :label="'Use custom model'"
                                        v-model="blockObject.data.customModel"
                                        color="accent"
                                    ></v-checkbox>
                                </v-col>
                        </v-row>
                        <v-row v-if="!blockObject.data.customModel">
                                <v-col cols="12" md="4">
                                    <v-select
                                        :items="blockTypes"
                                        item-text="text"
                                        item-value="val"
                                        v-model="blockObject.data.blockType"
                                        label="Block model"
                                        hint="Block model"
                                        filled
                                        color="accent"
                                        item-color="accent"
                                    ></v-select>
                                </v-col>
                            </v-row>
                            <v-row v-else>
                                <v-col cols="12" md="3">
                                    <v-btn
                                        @click="modelPickerDialog = true"
                                    >
                                        Select model
                                    </v-btn>
                                </v-col>
                                <v-col cols="12" md="9">
                                Selected model:
                                <p>{{blockObject.data.customBlockModel}}</p>
                                </v-col>
                            </v-row>
                            <br />
                            <v-row>
                                <v-col>
                                <p class="text-caption">
                                    Upload the necessary texture(s) here for the custom model. Ensure that the texture file(s) are named according to what the model will expect.
                                </p>
                                <multiple-picture
                                    title="Selected textures"
                                    :pictures="blockObject.data.customTextures"
                                    :projectName="activeProject"
                                    @change="(newPictures) => (updateCustomTextures(newPictures))"
                                />
                                </v-col>
                            </v-row>
                            <v-container
                                v-if="blockObject.data.blockType == 'Cube' && !blockObject.data.customModel"
                            >
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <h4
                                            >All six sides of the block share
                                            this texture</h4
                                        >
                                        <v-img
                                            @click.stop="
                                                clickTextureSlot('cube1')
                                            "
                                            style="image-rendering: pixelated;"
                                            :src="
                                                this.blockObject.data.cube1.src
                                            "
                                            class="texture-image mt-2"
                                            max-height="128px"
                                            max-width="128px"
                                        />
                                    </v-col>
                                </v-row>
                            </v-container>
                            <v-container
                                v-if="blockObject.data.blockType == 'Cube C'"
                            >
                                <v-row>
                                    <v-col cols="12" md="2">
                                        <h4>Top and bottom</h4>
                                        <v-img
                                            @click.stop="
                                                clickTextureSlot('cube1')
                                            "
                                            style="image-rendering: pixelated;"
                                            :src="
                                                this.blockObject.data.cube1.src
                                            "
                                            class="texture-image mt-2"
                                            max-height="128px"
                                            max-width="128px"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="2">
                                        <h4>Sides</h4>
                                        <v-img
                                            @click.stop="
                                                clickTextureSlot('cube2')
                                            "
                                            style="image-rendering: pixelated;"
                                            :src="
                                                this.blockObject.data.cube2.src
                                            "
                                            class="texture-image mt-2"
                                            max-height="128px"
                                            max-width="128px"
                                        />
                                    </v-col>
                                </v-row>
                            </v-container>
                            <v-container
                                v-if="blockObject.data.blockType == 'Cube SS'"
                            >
                                <v-row>
                                    <v-col cols="12" md="2">
                                        <h4>Top</h4>
                                        <v-img
                                            @click.stop="
                                                clickTextureSlot('cube1')
                                            "
                                            style="image-rendering: pixelated;"
                                            :src="
                                                this.blockObject.data.cube1.src
                                            "
                                            class="texture-image mt-2"
                                            max-height="128px"
                                            max-width="128px"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="2">
                                        <h4>Bottom</h4>
                                        <v-img
                                            @click.stop="
                                                clickTextureSlot('cube2')
                                            "
                                            style="image-rendering: pixelated;"
                                            :src="
                                                this.blockObject.data.cube2.src
                                            "
                                            class="texture-image mt-2"
                                            max-height="128px"
                                            max-width="128px"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="2">
                                        <h4>North</h4>
                                        <v-img
                                            @click.stop="
                                                clickTextureSlot('cube3')
                                            "
                                            style="image-rendering: pixelated;"
                                            :src="
                                                this.blockObject.data.cube3.src
                                            "
                                            class="texture-image mt-2"
                                            max-height="128px"
                                            max-width="128px"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="2">
                                        <h4>South</h4>
                                        <v-img
                                            @click.stop="
                                                clickTextureSlot('cube4')
                                            "
                                            style="image-rendering: pixelated;"
                                            :src="
                                                this.blockObject.data.cube4.src
                                            "
                                            class="texture-image mt-2"
                                            max-height="128px"
                                            max-width="128px"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="2">
                                        <h4>East</h4>
                                        <v-img
                                            @click.stop="
                                                clickTextureSlot('cube5')
                                            "
                                            style="image-rendering: pixelated;"
                                            :src="
                                                this.blockObject.data.cube5.src
                                            "
                                            class="texture-image mt-2"
                                            max-height="128px"
                                            max-width="128px"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="2">
                                        <h4>West</h4>
                                        <v-img
                                            @click.stop="
                                                clickTextureSlot('cube6')
                                            "
                                            style="image-rendering: pixelated;"
                                            :src="
                                                this.blockObject.data.cube6.src
                                            "
                                            class="texture-image mt-2"
                                            max-height="128px"
                                            max-width="128px"
                                        />
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-container>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header><h3>Loot</h3></v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-select
                                        v-model="blockObject.data.lootTable"
                                        :items="lootTables"
                                        v-if="lootTables.length"
                                        item-text="name"
                                        item-value="json"
                                        label="Loot table"
                                        filled
                                        hint="Loot table"
                                        color="accent"
                                        item-color="accent"
                                        return-object
                                    ></v-select>
                                    <p class="text-caption" v-else>
                                        No loot tables have been created. Loot tables you create will be shown here.
                                    </p>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-form>
        <h3>Events</h3>
        <element-nodes
            arrayName="blocks"
            :defaultNodes="defaultNodes"
            :entryName="name"
            :projectName="activeProject"
            @ready="(graphInstance) => graph = graphInstance"
        />
        <TexturePickerDialog
            v-model="pickerDialog"
            v-bind:activeProject="activeProject"
            @selected-texture="onTextureSelect"
        />
        <ModelPickerDialog
            v-model="modelPickerDialog"
            :activeProject="activeProject"
            @selected-model="onModelSelect"
            @close-dialog="modelPickerDialog = false"
        />
    </v-container>
</template>
<script>
import Slider from "../form-components/Slider";
import MultiplePicture from '../form-components/MultiplePicture.vue'
import TexturePickerDialog from "../dialogs/TexturePickerDialog";
import ModelPickerDialog from "../dialogs/ModelPickerDialog.vue";
import ElementNodes from "../ElementNodes";
import FormActions, { formActionHandlers } from "../form-components/FormActions";
import placeholder from "../../assets/img/placeholder.png";
import Tooltip from "../utility/Tooltip.vue";

export default {
    components: {
        Slider,
        TexturePickerDialog,
        ElementNodes,
        FormActions,
        MultiplePicture,
        ModelPickerDialog,
        Tooltip
    },
    props: ["name", "activeProject"],
    mixins: [formActionHandlers],
    methods: {
        updateCustomTextures(newTextures) {
            this.blockObject.data.customTextures = newTextures;
        },
        onModelSelect(model) {
            console.log(model)
            this.blockObject.data.customBlockModel = model;
        },
        saveEl() {
            this.validateElement({formRef: this.$refs.blockForm}).then(value => {
                this.blockObject.data.registryName = this.registryName;
                this.graph?.getNodeDictionary();
                //this.graph.runStep(1);
                this.blockObject.data.javaImports = this.graph.javaImports;
                this.blockObject.data.nodeDictionary = this.graph.serializeNodeDictionary();

                console.log(this.blockObject.data.nodeDictionary);

                this.saveElement({
                    formData: {
                        projectName: this.activeProject,
                        arrayName: "blocks",
                        entryName: this.name,
                        data: this.blockObject,
                    },
                    nodesData: {
                        projectName: this.activeProject,
                        arrayName: "blocks",
                        entryName: this.name,
                        data: JSON.stringify(this.graph?.serialize())
                    }
                })
            }, reason => {
                console.log(reason);
            });
        },
        deleteEl() {
            this.deleteElement({
                projectName: this.activeProject,
                name: this.name,
                type: "blocks",
            })
        },
        help() {
            const url = "https://modfoundry.app/docs/mod-elements/how-to-make-a-block";
            this.openHelpLink(url);
        },
        clickTextureSlot: function(selected) {
            this.pickerDialog = true;
            this.selectedTexture = selected;
        },
        onTextureSelect(selected) {
            this.pickerDialog = false;
            this.blockObject.data[this.selectedTexture] = selected;
        },
        handlePickerDialogClose() {
            this.pickerDialog = false;
        },
    },
    data: () => ({
        tooltip_component: 'Tooltip',
        pickerDialog: false,
        panel: [0, 2],
        modelPickerDialog: false,
        blockObject: {
            id: -1,
            name: "",
            icon: "",
            type: "",
            changes: false,
            data: {
                inGameName: "test",
                material: "STONE",
                sound: "STONE",
                hardness: 1,
                blockType: "Cube",
                renderType: {name: "Solid", val: "solid"},
                resistance: 1,
                jumpFactor: 1,
                friction: 0.6,
                speedFactor: 1,
                hasCollision: true,
                isValidSpawn: true,
                isRedstoneConductor: false,
                isSuffocating: true,
                requiresCorrectToolForDrop: false,
                cube1: { src: placeholder, name: "placeholder.png" },
                cube2: { src: placeholder, name: "placeholder.png" },
                cube3: { src: placeholder, name: "placeholder.png" },
                cube4: { src: placeholder, name: "placeholder.png" },
                cube5: { src: placeholder, name: "placeholder.png" },
                cube6: { src: placeholder, name: "placeholder.png" },
                customModel: false,
                customBlockModel: "",
                customTextures: [

                ]
            },
        },
        nameRules: [
            (v) => !!v || "Name is required",
        ],
        publicPath: process.env.BASE_URL,
        valid: false,
        canvas: {
            width: 290,
            height: 204,
        },
        blockTypes: [
            { text: "Cube - all 6 sides same", val: "Cube" },
            {
                text: "Cube Column - 4 sides same and same top/bottom",
                val: "Cube C",
            },
            {
                text: "Cube Six Sides - all 6 sides have a different texture",
                val: "Cube SS",
            },
        ],
        materials: [
            "AIR",
            "STRUCTURAL_AIR",
            "PORTAL",
            "CLOTH_DECORATION",
            "PLANT",
            "WATER_PLANT",
            "REPLACEABLE_PLANT",
            "REPLACEABLE_FIREPROOF_PLANT",
            "REPLACEABLE_WATER_PLANT",
            "WATER",
            "BUBBLE_COLUMN",
            "LAVA",
            "TOP_SNOW",
            "FIRE",
            "DECORATION",
            "WEB",
            "BUILDABLE_GLASS",
            "CLAY",
            "DIRT",
            "GRASS",
            "ICE_SOLID",
            "SAND",
            "SPONGE",
            "SHULKER_SHELL",
            "WOOD",
            "NETHER_WOOD",
            "BAMBOO_SAPLING",
            "BAMBOO",
            "WOOL",
            "EXPLOSIVE",
            "LEAVES",
            "GLASS",
            "ICE",
            "CACTUS",
            "STONE",
            "METAL",
            "SNOW",
            "HEAVY_METAL",
            "BARRIER",
            "PISTON",
            "CORAL",
            "VEGETABLE",
            "EGG",
            "CAKE",
        ],
        sounds: [
            "WOOD",
            "GRAVEL",
            "GRASS",
            "LILY_PAD",
            "STONE",
            "METAL",
            "GLASS",
            "WOOL",
            "SAND",
            "SNOW",
            "LADDER",
            "ANVIL",
            "SLIME_BLOCK",
            "HONEY_BLOCK",
            "WET_GRASS",
            "CORAL_BLOCK",
            "BAMBOO",
            "BAMBOO_SAPLING",
            "SCAFFOLDING",
            "SWEET_BERRY_BUSH",
            "CROP",
            "HARD_CROP",
            "VINE",
            "NETHER_WART",
            "LANTERN",
            "STEM",
            "NYLIUM",
            "FUNGUS",
            "ROOTS",
            "SHROOMLIGHT",
            "WEEPING_VINES",
            "TWISTING_VINES",
            "SOUL_SAND",
            "SOUL_SOIL",
            "BASALT",
            "WART_BLOCK",
            "NETHERRACK",
            "NETHER_BRICKS",
            "NETHER_SPROUTS",
            "NETHER_ORE",
            "BONE_BLOCK",
            "NETHERITE_BLOCK",
            "ANCIENT_DEBRIS",
            "LODESTONE",
            "CHAIN",
            "NETHER_GOLD_ORE",
            "GILDED_BLACKSTONE",
        ],
        defaultNodes: [
            "block/onDestroyedByPlayer",
            "block/stepOn"
        ],
        graph: null,
        lootTables: [],
        renderTypes: [
            {name: "Solid", val: "solid"},
            {name: "Translucent", val: "translucent"},
            {name: "Cutout", val: "cutout"},
        ]
    }),
    async mounted() {
        this.$root.$on(
            "close-selecttexturedialog",
            this.handlePickerDialogClose
        );

        const project = await window.ipc.invoke("database", {
            func: "getProjectDataByName",
            data: this.activeProject,
        });

        this.blockObject = project.blocks.find((b) => b.name === this.name);

        for (let lootTable of project.loot) {
            this.lootTables.push({name: lootTable.data.registryName, json: lootTable.data.lootTableJSON})
        }
    },
    beforeDestroy() {
        this.$root.$off(
            "close-selecttexturedialog",
            this.handlePickerDialogClose
        );
    },
    computed: {
        registryName() {
            return this.blockObject.data.inGameName
                .replace(/ /g, "_")
                .toLowerCase();
        },
        myid() {
            return "mycanvas" + this.blockObject.id;
        },
        customModelUrl() {
            return this.blockObject.data.customModel;
        },
    },
    

};
</script>
