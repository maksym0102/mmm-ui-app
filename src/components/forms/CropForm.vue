<template>
  <v-container style="background-color: #232323;" class="content-wrapper">
    <form-actions :name="name" :type="'Crop'" @save="saveEl" @delete="deleteEl" @help="help" />
    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header><h3>General</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form v-model="valid" ref="cropForm" @submit.prevent="validate">
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    dense
                    filled
                    label="In game name"
                    color="accent"
                    v-model="cropObject.data.inGameName"
                    required
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header><h3>Growth Stages</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container>
            <div v-for="(stage, i) in cropObject.data.stages" :key="i">
              <v-row >
                <v-col cols="auto" class="d-flex align-center">
                  <span>{{ i+1 }}</span>
                </v-col>
                <v-col cols="auto" class="d-flex flex-column justify-center">
                  <v-row>
                    <v-col cols="auto">
                      <h4 class="d-flex align-center">
                        Stage texture
                      </h4>
                      <div class="item-tile">
                        <img
                          @click.stop="clickTextureSlot(i)"
                          :src="stage.texture.src"
                          class="texture-image"
                          style="image-rendering: pixelated; height: 100%; width: 100%;"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-divider class="my-5"></v-divider>
            </div>
            <v-row>
              <v-col cols="auto" class="text-right">
                <v-btn class="mr-5" color="accent" type="button" outlined @click="addNewStage">
                  Add New +
                </v-btn>
                <v-btn color="danger" type="button" outlined @click="deleteStage">
                  Delete
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header><h3>Items</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container>
            <v-row>
              <!-- <v-col cols="12" md="4">
                <h4 class="d-flex align-center">
                    Harvest item
                  </h4>
                  <v-img
                    @click.stop="clickItemSlot('harvestItem')"
                    :src="cropObject.data.harvestItem.texture"
                    style="image-rendering: pixelated;"
                    class="texture-image mt-2"
                    max-height="128px"
                    max-width="128px"
                  />
              </v-col> -->
              <v-col cols="12" md="4">
                <h4 class="d-flex align-center">
                    Seed item
                  </h4>
                  <v-img
                    @click.stop="clickItemSlot('seedItem')"
                    :src="cropObject.data.seedItem.texture"
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
      <v-expansion-panel>
        <v-expansion-panel-header><h3>Loot</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-select
                            v-model="cropObject.data.lootTable"
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
    <TexturePickerDialog
      v-model="pickerDialog"
      v-bind:activeProject="projectName"
      @selected-texture="onTextureSelect"
    />
    <BlockItemPickerDialog
      v-model="itemPickerDialog"
      :activeProject="projectName"
      @selected-item="addItem"
      @close-selectitemdialog="pickerDialog = false"
    />
  </v-container>
</template>
<script>
import TexturePickerDialog from "../dialogs/TexturePickerDialog";
import BlockItemPickerDialog from "../dialogs/BlockItemPickerDialog";
import placeholder from "../../assets/img/placeholder.png";
import ItemPlaceholder from "../../assets/img/item-placeholder.png";
import FormActions, {
  formActionHandlers,
} from "../form-components/FormActions";

export default {
  name: "ToolForm",
  components: { 
    TexturePickerDialog, 
    FormActions,
    BlockItemPickerDialog
  },
  props: ["name", "projectName"],
  data: () => ({
    panel: [0],
    selectedRow: null,
    modelPickerDialog: false,
    ModelPlaceholder: placeholder,
    pickerDialog: false,
    itemPickerDialog: false,
    texturePickerDialog: false,
    selectedTextureIndex: null,
    itemPlaceholder: ItemPlaceholder,
    selectedItem: "",
    nameRules: [
      (v) => !!v || "Name is required",
    ],
    valid: false,
    cropObject: {
      data: {
        inGameName: "",
        stages: [],
        harvestItem: {
          name: "",
          texture: ItemPlaceholder
        },
        seedItem: {
          name: "",
          texture: ItemPlaceholder
        }
      },
    },
    lootTables: []
  }),
  computed: {
    registryName() {
      return this.cropObject.data.inGameName.replace(/ /g, "_").toLowerCase();
    },
    cropAge() {
      if (this.cropObject.data.stages.length) {
        return this.cropObject.data.stages.length - 1;
      }
      else {
        return 0;
      }
    },
    cropBlockState() {
      let bs = [];
      for (let i = 0; i < this.cropObject.data.stages.length; i++) {
        bs.push(`"age=${i}": { "model": "${this.projectName}:block/${this.cropObject.data.stages[i].texture.name}}" }`);
      }
      console.log(bs)
      return bs.join(",");
    }
  },
  mixins: [formActionHandlers],
  methods: {
    saveEl: function() {
      this.cropObject.data.cropBlockState = this.cropBlockState;
      this.cropObject.data.cropAge = this.cropAge;
      this.validateElement({formRef: this.$refs.cropForm}).then(value => {
        this.cropObject.data.registryName = this.registryName;
        this.saveElement({
          formData: {
            projectName: this.projectName,
            arrayName: "crops",
            entryName: this.name,
            data: this.cropObject,
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
        type: "crops",
      });
    },
    handleModelPicker(index) {
      this.selectedRow = index;
      this.modelPickerDialog = true;
    },
    onModelSelect(model) {
      this.modelPickerDialog = false;
      const index = this.selectedRow;
      this.cropObject.data.stages[index].model = model;
    },
    customModelUrl(index) {
      return this.cropObject.data.stages[index].model;
    },

    handleTexturePicker(index) {
      this.selectedRow = index;
      this.texturePickerDialog = true;
    },
    clickTextureSlot: function(selectedIndex) {
      this.pickerDialog = true;
      this.selectedTextureIndex = selectedIndex;
    },
    onTextureSelect(texture) {
      this.pickerDialog = false;
      this.cropObject.data.stages[this.selectedTextureIndex].texture = texture;
    },
    deleteItemTexture(index, index1) {
      this.cropObject.data.stages[index].texture.splice(index1, 1);
    },
    handlePickerDialogClose() {
      this.pickerDialog = false;
    },
    help() {
      const url = "https://modfoundry.app/docs/intro";
      this.openHelpLink(url);
    },
    addNewStage() {
      const newItem = {
        model: '',
        texture: {}
      };
      this.cropObject.data.stages.push(newItem);
    },
    deleteStage() {
      this.cropObject.data.stages.splice(-1);
    },
     clickItemSlot: function(selected) {
      this.itemPickerDialog = true;
      this.selectedItem = selected;
    },
    addItem: function(selected) {
      console.log("adding ")
      console.log(selected)
      this.itemPickerDialog = false;
      this.cropObject.data[this.selectedItem] = selected;
    },
  },
  mounted() {
    window.ipc
      .invoke("database", {
        func: "getProjectDataByName",
        data: this.projectName,
      })
      .then((result) => {
        this.cropObject = result.crops.find(
          (b) => b.name === this.name
        );
        for (let lootTable of result.loot) {
          this.lootTables.push({name: lootTable.data.registryName, json: lootTable.data.lootTableJSON})
        }
      });
    this.$root.$on("close-selecttexturedialog", this.handlePickerDialogClose);
  },
  beforeDestroy() {
    this.$root.$off("close-selecttexturedialog", this.handlePickerDialogClose);
  },
};
</script>
