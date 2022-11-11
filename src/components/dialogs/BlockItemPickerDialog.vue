<template>
  <v-dialog width="50%" v-bind="$attrs" v-on="$listeners">
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title> Select a block / item </v-card-title>
        <v-container class="mb-5">
          <v-row class="ml-4">
            <v-col cols="12" md="10">
              <v-checkbox
                :label="'Include default Minecraft items'"
                v-model="includeMinecraftItems"
                color="accent"
              ></v-checkbox>
              <v-checkbox
                :label="'Include custom items from this mod'"
                v-model="includeCustomItems"
                color="accent"
              ></v-checkbox>
              <v-checkbox
                :label="'Include custom blocks from this mod'"
                v-model="includeCustomBlocks"
                color="accent"
              ></v-checkbox>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="selected"
                :items="items"
                dense
                filled
                color="accent"
                item-color="accent"
                label="Item"
                item-value="name"
                item-text="name"
                return-object
              >
              <template v-slot:selection="data">
                {{data.item.name}}
              </template>
                <template v-slot:item="data">
                  <template>
                    <v-list-item-avatar rounded="0">
                      <img :src="data.item.texture" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="button" outlined @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn
            type="button"
            outlined
            color="accent"
            :disabled="!selected"
            @click.stop="submitSelected"
          >
            Select
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
import items from "../../assets/data/items_list_117.json";
import itemPlaceholder from "../../assets/img/item-placeholder.png";
export default {
  name: "BlockItemPickerDialog",
  props: ["activeProject"],
  data: () => ({
    customItems: [],
    customBlocks: [],
    customTools: [],
    customArmors: [],
    mcItems: [],
    selected: {
      name: "",
      texture: ""
    },
    selectedIndex: null,
    selectedBase64: null,
    includeMinecraftItems: true,
    includeCustomItems: true,
    includeCustomBlocks: true,
  }),
  computed: {
    items() {
      let returnItems = [];
      if (this.includeMinecraftItems) {
        returnItems = this.mcItems;
      }
      if (this.includeCustomItems) {
        this.customItems.forEach((customItem) => {
          returnItems.push(customItem);
        });
      }
      if (this.includeCustomBlocks) {
        this.customBlocks.forEach((customBlock) => {
          returnItems.push(customBlock);
        });
      }
      this.customTools.forEach((customTool) => {
        returnItems.push(customTool);
      });
      this.customArmors.forEach((customArmor) => {
        returnItems.push(customArmor);
      });
      return returnItems;
    },
  },
  methods: {
    textureImage: function(item) {
      const customItem = this.customItems.filter((e) => e.name === item);
      const customBlock = this.customBlocks.filter((e) => e === item);
      const customTool = this.customTools.filter((e) => e.name === item);
      const customArmor = this.customArmors.filter((e) => e.name === item);

      if (customItem.length) {
        return customItem[0].texture;
      } else if (customBlock.length) {
        return require(`../../assets/img/block-placeholder.png`);
      } else if (customTool.length) {
        return customTool[0].texture;
      } else if (customArmor.length) {
        return customArmor[0].texture;
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
    getItemWithTexture(item) {
      let returnItem = {};
      returnItem.name = item;
      try {
          returnItem.texture = require(`../../assets/img/icons/117/${item
            .slice(10)
            .toLowerCase()}.png`);
        } catch (error) {
          returnItem.texture = itemPlaceholder;
        }
      return returnItem;
    },
    closeDialog: function() {
      this.$emit("close-selectitemdialog");
      this.selected = {
        name: "",
        texture: ""
      };
    },
    submitSelected: function() {
      this.$emit("selected-item", this.selected);
      this.selected = {
        name: "",
        texture: ""
      };
    },
  },
  mounted() {
    window.ipc
      .invoke("database", {
        func: "getProjectDataByName",
        data: this.activeProject,
      })
      .then((result) => {
        // items
        result.items.forEach((item) => {
          this.customItems.push({
            name: this.activeProject + ":" + item.data.registryName,
            texture: item.data.itemTexture.src
          });
        });
        // blocks
        result.blocks.forEach((block) => {
          this.customBlocks.push({
            name: this.activeProject + ":" + block.data.registryName,
            texture: require(`../../assets/img/block-placeholder.png`)
        });
        });
        // tools
        result.tools.forEach((tool) => {
          this.customTools.push({
            name: this.activeProject + ":" + tool.data.registryName,
            texture: tool.data.itemTexture.src
          });
        });
        // armor
        result.armor.forEach((armor) => {
          this.customArmors.push({
            name: this.activeProject + ":" + armor.data.registryName + "_helmet",
            texture: armor.data.helmetTexture.src
          });
          this.customArmors.push({
            name: this.activeProject + ":" + armor.data.registryName + "_chestplate",
            texture: armor.data.chestplateTexture.src
          });
          this.customArmors.push({
            name: this.activeProject + ":" + armor.data.registryName + "_leggings",
            texture: armor.data.leggingTexture.src
          });
          this.customArmors.push({
            name: this.activeProject + ":" + armor.data.registryName + "_boots",
            texture: armor.data.bootTexture.src
          });
        });
      });

      items.items.forEach((item) => {
        this.mcItems.push(this.getItemWithTexture(item));
      });
  },
};
</script>
