<template>
  <v-container style="background-color: #232323;" class="content-wrapper">
    <form-actions :name="name" :type="'Tool'" @save="saveEl" @delete="deleteEl" @help="help" />
    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header><h3>General</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form v-model="valid" ref="toolForm" @submit.prevent="validate">
            <v-container>
              <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      dense
                      filled
                      label="In game name"
                      color="accent"
                      v-model="toolObject.data.inGameName"
                      required
                      :rules="nameRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                  <v-select
                    v-model="toolObject.data.toolType"
                    :items="toolTypes"
                    label="Tool type"
                    color="accent"
                    filled
                    item-color="accent"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="toolObject.data.tier"
                    :items="toolTiers"
                    label="Tier"
                    color="accent"
                    filled
                    item-color="accent"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="toolObject.data.attackBonus"
                    label="Attack bonus"
                    max="10"
                    min="0"
                    step="1"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="toolObject.data.speedBonus"
                    label="Speed bonus"
                    max="20"
                    min="0"
                    step="1"
                  />
                </v-col>
                <v-col cols="4">
                    <v-select
                    v-model="toolObject.data.creativeTab "
                    :items="creativeTabs"
                    item-text="name"
                    item-value="entry"
                    label="Creative tab"
                    return-object
                    filled
                    color="accent"
                    item-color="accent"
                    ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header><h3>Textures</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <h4>Tool texture</h4>
                <v-img
                  @click.stop="pickerDialog = true"
                  :src="toolObject.data.itemTexture.src"
                  style="image-rendering: pixelated;"
                  class="texture-image mt-2"
                  max-height="128px"
                  max-width="128px"
                />
              </v-col>
            </v-row>
          </v-container>
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
import Slider from '../form-components/Slider.vue';
import TexturePickerDialog from "../dialogs/TexturePickerDialog";
import ItemPlaceholder from "../../assets/img/item-placeholder.png";
import FormActions, {
  formActionHandlers,
} from "../form-components/FormActions";

export default {
  name: "ToolForm",
  components: { Slider, TexturePickerDialog, FormActions },
  props: ["name", "projectName"],
  data: () => ({
    panel: [0],
    itemPlaceholder: ItemPlaceholder,
    pickerDialog: false,
    nameRules: [
      (v) => !!v || "Name is required",
    ],
    valid: false,
    toolObject: {
      data: {
        itemTexture: {
            src: ItemPlaceholder,
            name: "ItemPlaceholder",
        },
      },
    },
    toolTypes: [
        "Pickaxe",
        "Axe",
        "Sword",
        "Shovel",
        "Hoe"
    ],
    toolTiers: [
        "WOOD",
        "STONE",
        "IRON",
        "DIAMOND",
        "GOLD",
        "NETHERITE"
    ],
    creativeTabs: [
        {name: "Misc", entry: "TAB_MISC"},
        {name: "Building Blocks", entry: "TAB_BUILDING_BLOCKS"},
        {name: "Decorations", entry: "TAB_DECORATIONS"},
        {name: "Redstone", entry: "TAB_REDSTONE"},
        {name: "Transportation", entry: "TAB_TRANSPORTATION"},
        {name: "Food", entry: "TAB_FOOD"},
        {name: "Tools", entry: "TAB_TOOLS"},
        {name: "Combat", entry: "TAB_COMBAT"},
        {name: "Brewing", entry: "TAB_BREWING"},
        {name: "Materials", entry: "TAB_MATERIALS"}
    ]
  }),
  computed: {
    registryName() {
      return this.name.replace(/ /g, "_").toLowerCase();
    }
  },
  mixins: [formActionHandlers],
  methods: {
    saveEl: function() {
      this.validateElement({formRef: this.$refs.toolForm}).then(value => {
        this.toolObject.data.registryName = this.registryName;
        this.saveElement({
          formData: {
            projectName: this.projectName,
            arrayName: "tools",
            entryName: this.name,
            data: this.toolObject,
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
        type: "tools",
      });
    },
    onTextureSelect(selected) {
      this.pickerDialog = false;
      this.toolObject.data.itemTexture = selected;
    },
    handlePickerDialogClose() {
      this.pickerDialog = false;
    },
    help() {
      const url = "https://modfoundry.app/docs/mod-elements/how-to-make-a-tool";
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
        console.log(result)
        this.toolObject = result.tools.find(
          (b) => b.name === this.name
        );
      });
    this.$root.$on("close-selecttexturedialog", this.handlePickerDialogClose);
  },
  beforeDestroy() {
    this.$root.$off("close-selecttexturedialog", this.handlePickerDialogClose);
  },
};
</script>
