<template>
  <v-container class="content-wrapper">
    <form-actions :name="name" :type="'Painting'" @save="saveEl" @delete="deleteEl" @help="help" />
    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header><h3>General</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="paintingObject.data.width"
                    label="Painting width"
                    min="16"
                    step="16"
                    max="64"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="paintingObject.data.height"
                    label="Painting Height"
                    min="16"
                    step="16"
                    max="64"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <h4>Item texture</h4>
                  <v-img
                    @click.stop="pickerDialog = true"
                    :src="paintingObject.data.texture.src"
                    style="image-rendering: pixelated;"
                    class="texture-image mt-2"
                    max-height="128px"
                    max-width="128px"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <TexturePickerDialog
      v-model="pickerDialog"
      v-bind:activeProject="projectName"
      @selected-texture="onTextureSelect"
    />
  </v-container>
</template>
<script>
import Slider from "../form-components/Slider";
import TexturePickerDialog from "../dialogs/TexturePickerDialog";
import ItemPlaceholder from "../../assets/img/item-placeholder.png";
import FormActions, { formActionHandlers } from "../form-components/FormActions";

export default {
  name: "StructureForm",
  components: { Slider, TexturePickerDialog, FormActions },
  props: ["name", "projectName"],
  data: () => ({
    panel: [0],
    pickerDialog: false,
    selectedTexture: "",
    paintingObject: {
      data: {
        height: 16,
        width: 16,
        texture: { src: ItemPlaceholder, name: "ItemPlaceholder" },
      },
    },
    defaultNodes: ["block/destroy", "block/playerDestroy"],
    graph: null
  }),
  computed: {
    registryName() {
      return this.name.replace(/ /g, "_").toLowerCase();
    }
  },
  mixins: [formActionHandlers],
  methods: {
    saveEl: function() {
      this.validatePainting(this.paintingObject).then(value => {
        this.paintingObject.data.registryName = this.registryName;

        this.saveElement({
          formData: {
            projectName: this.projectName,
            arrayName: "paintings",
            entryName: this.name,
            data: this.paintingObject,
          },
          nodesData: {
            projectName: this.projectName, 
            arrayName: "paintings", 
            entryName: this.name, 
            data: {}
          }
        });
      }, reason => {
        console.log(reason);
      });
    },
    deleteEl: function() {
      this.deleteElement({
        projectName: this.projectName,
        name: this.name,
        type: "paintings",
      })
    },
    onTextureSelect(selected) {
      this.pickerDialog = false;
      this.paintingObject.data.texture = selected;
    },
    help() {
      const url = "https://modfoundry.app/docs/intro";
      this.openHelpLink(url);
    },
  },
  mounted() {
    window.ipc
      .invoke("database", {
        func: "getProjectDataByName",
        data: this.projectName,
      })
      .then((result) => {
        this.paintingObject = result.paintings.find(
          (b) => b.name === this.name
        );
      });

    this.$root.$on("close-selecttexturedialog", () => {
      this.pickerDialog = false;
    });
  },
};
</script>
