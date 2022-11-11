<template>
  <v-container class="content-wrapper">
    <form-actions :name="name" :type="'Structure'" @save="saveEl" @delete="deleteEl" @help="help" />
    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header><h3>General</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form>
            <v-container>
              <v-row>
               <v-col cols="12" md="4">
                  <v-select
                    v-model="structureObject.data.biomes"
                    :items="allBiomes"
                    label="Biomes to spawn in"
                    multiple
                    chips
                    hint="Biomes to spawn in"
                    persistent-hint
                    color="accent"
                    item-color="accent"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <Slider v-model="structureObject.data.offset" label="Ground offset" min="-100" step="1" max="200" />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider v-model="structureObject.data.probability" label="Spawn probability" min="0" step="1" max="100" />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
      
      <v-expansion-panel>
        <v-expansion-panel-header><h3>Model</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form>
            <v-container>
              <v-row>
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
              </v-row>
            </v-container>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header><h3>Events</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <element-nodes 
            arrayName="structures" 
            :defaultNodes="defaultNodes" 
            :entryName="name" 
            :projectName="projectName"
            @ready="(graphInstance) => graph = graphInstance"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    
    </v-expansion-panels>
    <ModelPickerDialog
      v-model="modelPickerDialog"
      :activeProject="projectName"
      @selected-model="onModelSelect"
      @close-dialog="modelPickerDialog = false"
    />
  </v-container>
</template>
<script>
import ModelPickerDialog from '../dialogs/ModelPickerDialog.vue';
import Slider from "../form-components/Slider";
import { ModelObj } from "vue-3d-model";
import placeholder from "../../assets/img/placeholder.png";
import ElementNodes from '../ElementNodes.vue';
import FormActions, { formActionHandlers } from "../form-components/FormActions";

export default {
  name: "StructureForm",
  components: {
    Slider, 
    ModelPickerDialog, 
    ModelObj, 
    ElementNodes, 
    FormActions 
  },
  props: ["name", "projectName"],
  data: () => ({
    panel: [0],
    pickerDialog: false,
    selectedTexture: "",
    modelPickerDialog: false,
    picPlaceholder: placeholder,
    structureObject: {
      data: {
          biomes: [],
          offset: 0,
          probability: 50,
          customModel: ""
      }
    },
    allBiomes: [
        "badlands",
        "badlands_plateau"
    ],
    defaultNodes: ["block/destroy", "block/playerDestroy"],
    graph: null
  }),
  computed: {
    customModelUrl() {
      return this.structureObject.data.customModel;
    },
  },
  mixins: [formActionHandlers],
  methods: {
    saveEl: function() {
      this.saveElement({
        formData: {
          projectName: this.projectName,
          arrayName: "structures",
          entryName: this.name,
          data: this.structureObject
        },
        nodesData: {
          projectName: this.projectName, 
          arrayName: "structures", 
          entryName: this.name, 
          data: JSON.stringify(this.graph?.serialize())
        }
      });
    },
    deleteEl: function() {
      this.deleteElement({
        projectName: this.projectName,
        name: this.name,
        type: "structures",
      });
    },
    clickTextureSlot: function(selected) {
      this.pickerDialog = true;
      this.selectedTexture = selected;
    },
    onModelSelect(model) {
      this.structureObject.data.customModel = model;
    },
    help() {
      const url = "https://modfoundry.app/docs/intro";
      this.openHelpLink(url);
    }
  },
  created() {},
  mounted() {
    window.ipc
        .invoke("database", { func: "getProjectDataByName", data: this.projectName })
        .then((result) => {
          this.structureObject = result.structures.find((b) => b.name === this.name);
        });
  }
};
</script>
