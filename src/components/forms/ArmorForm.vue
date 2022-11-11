<template>
  <v-container style="background-color: #232323;" class="content-wrapper">
    <form-actions :name="name" :type="'Armor'" @save="saveEl" @delete="deleteEl" @help="help" />
    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header><h3>General</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form v-model="valid" ref="armorForm" @submit.prevent="validate">
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    dense
                    filled
                    label="Helmet item in game name"
                    color="accent"
                    v-model="armorObject.data.helmetInGameName"
                    required
                    :rules="helmetRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    dense
                    filled
                    label="Chestplate item in game name"
                    v-model="armorObject.data.chestplateInGameName"
                    color="accent"
                    required
                    :rules="chestplateRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    dense
                    filled
                    label="Legging item in game name"
                    v-model="armorObject.data.leggingsInGameName"
                    color="accent"
                    required
                    :rules="leggingRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    dense
                    filled
                    label="Boot item in game name"
                    v-model="armorObject.data.bootsInGameName"
                    color="accent"
                    required
                    :rules="bootRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="armorObject.data.durabilityMultiplier"
                    label="Durability Multiplier"
                    max="100"
                    min="0"
                    step="1"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="armorObject.data.enchantability"
                    label="Enchantability"
                    max="50"
                    min="0"
                    step="1"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="armorObject.data.helmetProtection"
                    label="Helmet Protection"
                    max="20"
                    min="0"
                    step="1"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="armorObject.data.chestProtection"
                    label="Chestplate Protection"
                    max="20"
                    min="0"
                    step="1"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="armorObject.data.leggingProtection"
                    label="Legging Protection"
                    max="20"
                    min="0"
                    step="1"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="armorObject.data.bootProtection"
                    label="Boot Protection"
                    max="20"
                    min="0"
                    step="1"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="armorObject.data.toughness"
                    label="Toughness"
                    max="10"
                    min="0"
                    step="1"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="armorObject.data.knockbackResistance"
                    label="Knockback Resistance"
                    max="10"
                    min="0"
                    step="1"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <h4 class="d-flex align-center">
                    Repair item
                    <Tooltip :text="tooltipTitle('ArmorForm.RepairItem')" />  
                  </h4>
                  <v-img
                    @click.stop="clickItemSlot('repairItem')"
                    :src="armorObject.data.repairItem.texture"
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
      <v-expansion-panel>
        <v-expansion-panel-header><h3>Textures</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container>
            <v-row>
              <v-col cols="12" md="4">
                <h4 class="d-flex align-center">
                  Helmet item texture
                  <Tooltip :text="tooltipTitle('ArmorForm.HelmetItemTexture')" />  
                </h4>
                
                <v-img
                  @click.stop="clickTextureSlot('helmetTexture')"
                  :src="armorObject.data.helmetTexture.src"
                  style="image-rendering: pixelated;"
                  class="texture-image mt-2"
                  max-height="128px"
                  max-width="128px"
                />
              </v-col>
              <v-col cols="12" md="4">
                <h4 class="d-flex align-center">
                  Chestplate item texture 
                  <Tooltip :text="tooltipTitle('ArmorForm.ChestplateItemTexture')" />
                </h4>
                <v-img
                  @click.stop="clickTextureSlot('chestplateTexture')"
                  :src="armorObject.data.chestplateTexture.src"
                  style="image-rendering: pixelated;"
                  class="texture-image mt-2"
                  max-height="128px"
                  max-width="128px"
                />
              </v-col>
              <v-col cols="12" md="4">
                <h4 class="d-flex align-center">
                  Legging item texture
                  <Tooltip :text="tooltipTitle('ArmorForm.LeggingItemTexture')" />
                </h4>
                <v-img
                  @click.stop="clickTextureSlot('leggingTexture')"
                  :src="armorObject.data.leggingTexture.src"
                  style="image-rendering: pixelated;"
                  class="texture-image mt-2"
                  max-height="128px"
                  max-width="128px"
                />
              </v-col>
              <v-col cols="12" md="4">
                <h4 class="d-flex align-center">
                  Boot item texture
                  <Tooltip :text="tooltipTitle('ArmorForm.BootItemTexture')" />
                </h4>
                <v-img
                  @click.stop="clickTextureSlot('bootTexture')"
                  :src="armorObject.data.bootTexture.src"
                  style="image-rendering: pixelated;"
                  class="texture-image mt-2"
                  max-height="128px"
                  max-width="128px"
                />
              </v-col>
              <v-col cols="12" md="4">
                <h4 class="d-flex align-center">
                  Layer 1 texture
                  <Tooltip :text="tooltipTitle('ArmorForm.Layer1Texture')" />
                </h4>
                <v-img
                  @click.stop="clickTextureSlot('layer1Texture')"
                  :src="armorObject.data.layer1Texture.src"
                  style="image-rendering: pixelated;"
                  class="texture-image mt-2"
                  max-height="128px"
                  max-width="128px"
                />
              </v-col>
              <v-col cols="12" md="4">
                <h4 class="d-flex align-center">
                  Layer 2 texture
                  <Tooltip :text="tooltipTitle('ArmorForm.Layer2Texture')" />
                </h4>
                <v-img
                  @click.stop="clickTextureSlot('layer2Texture')"
                  :src="armorObject.data.layer2Texture.src"
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
import ItemPlaceholder from "../../assets/img/item-placeholder.png";
import Slider from "../form-components/Slider.vue";
import BlockItemPickerDialog from "../dialogs/BlockItemPickerDialog";
import Tooltip from "../utility/Tooltip.vue";
import FormActions, {
  formActionHandlers,
} from "../form-components/FormActions";

export default {
  name: "ArmorForm",
  components: {
    TexturePickerDialog,
    Slider,
    Tooltip,
    BlockItemPickerDialog,
    FormActions,
  },
  props: ["name", "projectName"],
  data: () => ({
    customItems: [],
    customBlocks: [],
    panel: [0],
    itemPlaceholder: ItemPlaceholder,
    itemPickerDialog: false,
    pickerDialog: false,
    selectedTexture: null,
    selectedItem: "",
    helmetRules: [
      (v) => !!v || "Helmet item is required",
    ],
    chestplateRules: [
      (v) => !!v || "Chestplate item is required",
    ],
    leggingRules: [
      (v) => !!v || "Legging item is required",
    ],
    bootRules: [
      (v) => !!v || "Boot item is required",
    ],
    valid: false,
    armorObject: {
      data: {
        layer1Texture: {
          src: ItemPlaceholder,
          name: "ItemPlaceholder",
        },
        layer2Texture: {
          src: ItemPlaceholder,
          name: "ItemPlaceholder",
        },
        helmetTexture: {
          src: ItemPlaceholder,
          name: "ItemPlaceholder",
        },
        chestplateTexture: {
          src: ItemPlaceholder,
          name: "ItemPlaceholder",
        },
        leggingTexture: {
          src: ItemPlaceholder,
          name: "ItemPlaceholder",
        },
        bootTexture: {
          src: ItemPlaceholder,
          name: "ItemPlaceholder",
        },
        repairItem: {
          name: "",
          texture: ItemPlaceholder
        }
      },
    },
    creativeTabs: [
      { name: "Misc", entry: "TAB_MISC" },
      { name: "Building Blocks", entry: "TAB_BUILDING_BLOCKS" },
      { name: "Decorations", entry: "TAB_DECORATIONS" },
      { name: "Redstone", entry: "TAB_REDSTONE" },
      { name: "Transportation", entry: "TAB_TRANSPORTATION" },
      { name: "Food", entry: "TAB_FOOD" },
      { name: "Tools", entry: "TAB_TOOLS" },
      { name: "Combat", entry: "TAB_COMBAT" },
      { name: "Brewing", entry: "TAB_BREWING" },
      { name: "Materials", entry: "TAB_MATERIALS" },
    ],
  }),
  computed: {
    registryName() {
      return this.name.replace(/ /g, "_").toLowerCase();
    },
  },
  mixins: [formActionHandlers],
  methods: {
    saveEl() {
      this.armorObject.data.registryName = this.registryName;
      this.validateElement({formRef: this.$refs.armorForm}).then(value => {
        this.saveElement({
          formData: {
            projectName: this.projectName,
            arrayName: "armor",
            entryName: this.name,
            data: this.armorObject,
          },
        });
      }, reason => {
        console.log(reason);
      });
    },
    deleteEl() {
      this.deleteElement({
        projectName: this.projectName,
        name: this.name,
        type: "armor",
      });
    },
    textureImage: function(item) {
     const customItem = this.customItems.filter((e) => e.name === item);
      const customBlock = this.customBlocks.filter((e) => e === item);

      if (customItem.length) {
        return customItem[0].texture;
      } else if (customBlock.length) {
        return require(`../../assets/img/block-placeholder.png`);
      } else {
        try {
          return require(`../../assets/img/icons/117/${item
            .slice(10)
            .toLowerCase()}.png`);
        } catch (error) {
          return require(`../../assets/img/item-placeholder.png`);
        }
      }
    },
    clickTextureSlot: function(selected) {
      this.pickerDialog = true;
      this.selectedTexture = selected;
    },
    clickItemSlot: function(selected) {
      this.itemPickerDialog = true;
      this.selectedItem = selected;
    },
    addItem: function(selected) {
      this.itemPickerDialog = false;
      this.armorObject.data[this.selectedItem] = selected;
    },
    onTextureSelect(selected) {
      this.pickerDialog = false;
      this.armorObject.data[this.selectedTexture] = selected;
    },
    handlePickerDialogClose() {
      this.pickerDialog = false;
    },
    help() {
      const url = "https://modfoundry.app/docs/mod-elements/how-to-make-an-armor-set";
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
        console.log(result);
        this.armorObject = result.armor.find((b) => b.name === this.name);

        // items
        result.items.forEach((item) => {
          this.customItems.push({
            name: this.projectName + ":" + item.data.registryName,
            texture: item.data.itemTexture.src
          });
        });
	
        // blocks
        result.blocks.forEach((block) => {
          this.customBlocks.push(
            this.projectName + ":" + block.data.registryName
          );
        });
      });
    this.$root.$on("close-selecttexturedialog", this.handlePickerDialogClose);
  },
  beforeDestroy() {
    this.$root.$off("close-selecttexturedialog", this.handlePickerDialogClose);
  },
};
</script>
