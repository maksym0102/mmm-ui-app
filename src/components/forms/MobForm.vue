<template>
  <v-container class="content-wrapper">
    <form-actions :name="name" :type="'Mob'" @save="saveEl" @delete="deleteEl" @help="help" />
    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header><h3>General</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    dense
                    filled
                    label="In Game Name"
                    color="accent"
                    v-model="mobObject.data.inGameName"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="mobObject.data.health"
                    label="Health"
                    max="50"
                    min="1"
                    step="1"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="mobObject.data.experience"
                    label="Experience for killing"
                    max="100"
                    min="1"
                    step="1"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
      
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Texture and Model</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container>
            <v-row>
              <v-col cols="8" md="4">
                <template v-if="useCustomModel">
                  <!-- selected custom structure -->
                  <h4 style="margin-bottom: 10px">Mob model</h4>
                  <v-btn
                    width="128px"
                    height="128px"
                    style="padding: 0"
                    plain
                    @click="modelPickerDialog = true"
                  >
                    <ModelObj
                      v-if="customModelUrl"
                      :width="128"
                      :height="128"
                      :src="customModelUrl"
                      :rotation="{ x: 0, y: -0.5, z: -0.5 }"
                      :controlsOptions="{
                        enableRotate: false,
                      }"
                    />

                    <v-img
                      v-else
                      style="image-rendering: pixelated;"
                      :src="picPlaceholder"
                      class="texture-image mt-2"
                      width="100%"
                      height="100%"
                    />
                  </v-btn>
                </template>
                <template v-else>
                  <v-select
                    :items="modelTypes"
                    v-model="mobObject.data.model"
                    label="Mob model"
                    hint="The model for this mob. Make sure the chosen texture fits the selected model."
                    filled
                    color="accent"
                    item-color="accent"
                  />
                </template>
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  v-model="useCustomModel"
                  dark
                  hide-details
                  label="Use a custom model"
                />
              </v-col>
              <v-col cols="12" md="4">
                <h4>Texture</h4>
                <v-img
                  @click.stop="pickerDialog = true"
                  style="image-rendering: pixelated;"
                  :src="mobObject.data.mobTexture"
                  class="texture-image mt-2"
                  height="128px"
                  width="128px"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header><h3>Events</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <element-nodes 
            arrayName="mobs" 
            :defaultNodes="defaultNodes" 
            :entryName="name" 
            :projectName="projectName"
            @ready="(graphInstance) => graph = graphInstance"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <TexturePickerDialog
      v-model="pickerDialog"
      :activeProject="projectName"
      @selected-texture="onTextureSelect"
    />
    <ModelPickerDialog
      v-model="modelPickerDialog"
      :activeProject="projectName"
      @selected-model="onModelSelect"
      @close-dialog="modelPickerDialog = false"
    />
  </v-container>
</template>
<script>
import Slider from "../form-components/Slider";
import placeholder from "../../assets/img/placeholder.png";
import TexturePickerDialog from "../dialogs/TexturePickerDialog";
import ModelPickerDialog from "../dialogs/ModelPickerDialog.vue";
import { ModelObj } from "vue-3d-model";
import ElementNodes from '../ElementNodes.vue';
import FormActions, { formActionHandlers } from "../form-components/FormActions";

export default {
  name: "MobForm",
  components: { 
    Slider, 
    TexturePickerDialog, 
    ModelPickerDialog, 
    ModelObj, 
    ElementNodes, 
    FormActions 
  },
  props: ["name", "projectName"],
  data: () => ({
    panel: [0],
    pickerDialog: false,
    modelPickerDialog: false,
    useCustomModel: false,
    selectedTexture: "",
    picPlaceholder: placeholder,
    mobObject: {
      data: {
        inGameName: "",
        health: 20,
        experience: 5,
        model: "Axolotl",
        mobTexture: placeholder,
        customModel: "",
      },
    },
    modelTypes: [
      "Axolotl",
      "Bat",
      "Bee",
      "Blaze",
      "Cat",
      "Chicken",
      "Cow",
      "Creeper",
      "Dolphin",
      "Drowned",
      "Enderman",
    ],
    defaultNodes: ["block/destroy", "block/playerDestroy"],
    graph: null,
  }),
  computed: {
    customModelUrl() {
      return this.mobObject.data.customModel;
    },
  },
  mixins: [formActionHandlers],
  methods: {
    saveEl: function() {
      const mobObject = {...this.mobObject};

      if (!this.useCustomModel) {
        mobObject.data.customModel = "";
      }

      this.saveElement({
        formData: {
          projectName: this.projectName,
          arrayName: "mobs",
          entryName: this.name,
          data: mobObject,
        },
        nodesData: {
          projectName: this.projectName, 
          arrayName: "mobs", 
          entryName: this.name, 
          data: JSON.stringify(this.graph?.serialize())
        }
      })
    },
    deleteEl: function() {
      this.deleteElement({
        projectName: this.projectName,
        name: this.name,
        type: "mobs",
      })
    },
    onTextureSelect(selected) {
      this.pickerDialog = false;
      this.mobObject.data.mobTexture = selected;
    },
    onModelSelect(model) {
      this.mobObject.data.customModel = model;
    },
    help() {
      const url = "https://modfoundry.app/docs/intro";
      this.openHelpLink(url);
    },
  },
  created() {},
  async mounted() {
    const result = await window.ipc.invoke("database", {
      func: "getProjectDataByName",
      data: this.projectName,
    });

    const currentMob = result.mobs.find((b) => b.name === this.name);

    this.mobObject = currentMob;

    if (currentMob.data?.customModel) {
      this.$nextTick(() => {
        this.useCustomModel = true;
      });
    }

    this.$root.$on("close-selecttexturedialog", () => {
      this.pickerDialog = false;
    });
  },
};
</script>
