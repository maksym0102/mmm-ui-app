<template>
  <v-container class="content-wrapper">
    <form-actions :name="name" :type="'Recipe'" @save="saveEl" @delete="deleteEl" @help="help" />
    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header><h3>General</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                :items="recipeTypes"
                label="Recipe Type"
                v-model="recipeObject.data.recipeType"
                hint="The type of recipe"
                filled
                color="accent"
                item-color="accent"
              ></v-select>
            </v-col>
          </v-row>
          <v-container v-if="recipeObject.data.recipeType === 'Shaped Recipe'">
            <v-row>
              <v-col cols="12" md="5">
                <h3 style="margin-bottom: 15px;">Shaped Recipe</h3>
                <div class="crafting-grid">
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItem1.name"
                      @click="deleteItemSlot('recipeItem1')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItem1.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItem1')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItem2.name"
                      @click="deleteItemSlot('recipeItem2')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItem2.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItem2')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItem3.name"
                      @click="deleteItemSlot('recipeItem3')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItem3.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItem3')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItem4.name"
                      @click="deleteItemSlot('recipeItem4')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItem4.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItem4')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItem5.name"
                      @click="deleteItemSlot('recipeItem5')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItem5.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItem5')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItem6.name"
                      @click="deleteItemSlot('recipeItem6')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItem6.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItem6')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItem7.name"
                      @click="deleteItemSlot('recipeItem7')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItem7.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItem7')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItem8.name"
                      @click="deleteItemSlot('recipeItem8')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItem8.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItem8')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItem9.name"
                      @click="deleteItemSlot('recipeItem9')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItem9.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItem9')"
                    />
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="2">
                <h3 style="margin-bottom: 15px;">&nbsp;</h3>
                <img
                  :src="craftingArrow"
                  style="image-rendering: pixelated; height: auto; width: 80%;"
                />
              </v-col>
              <v-col cols="12" md="5">
                <h3 style="margin-bottom: 15px;">Result</h3>
                <div
                  style="display:grid; grid-template-columns: 1fr 1fr 1fr;
                    grid-template-rows: 1fr 1fr 1fr;
                    grid-gap: 20px;"
                >
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.resultItem.name"
                      @click="deleteItemSlot('resultItem')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.resultItem.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('resultItem')"
                    />
                  </div>
                  <Slider
                    v-model="recipeObject.data.resultCount"
                    label="Amount Crafted"
                    max="64"
                    min="1"
                    step="1"
                  />
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-container v-if="recipeObject.data.recipeType === 'Shapeless Recipe'">
            <v-row>
              <v-col cols="12" md="5">
                <h3 style="margin-bottom: 15px;">Shapeless Recipe</h3>
                <div class="crafting-grid">
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItemShapeless1.name"
                      @click="deleteItemSlot('recipeItemShapeless1')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItemShapeless1.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItemShapeless1')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItemShapeless2.name"
                      @click="deleteItemSlot('recipeItemShapeless2')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItemShapeless2.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItemShapeless2')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItemShapeless3.name"
                      @click="deleteItemSlot('recipeItemShapeless3')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItemShapeless3.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItemShapeless3')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItemShapeless4.name"
                      @click="deleteItemSlot('recipeItemShapeless4')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItemShapeless4.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItemShapeless4')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItemShapeless5.name"
                      @click="deleteItemSlot('recipeItemShapeless5')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItemShapeless5.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItemShapeless5')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItemShapeless6.name"
                      @click="deleteItemSlot('recipeItemShapeless6')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItemShapeless6.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItemShapeless6')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItemShapeless7.name"
                      @click="deleteItemSlot('recipeItemShapeless7')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItemShapeless7.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItemShapeless7')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItemShapeless8.name"
                      @click="deleteItemSlot('recipeItemShapeless8')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItemShapeless8.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItemShapeless8')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.recipeItemShapeless9.name"
                      @click="deleteItemSlot('recipeItemShapeless9')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.recipeItemShapeless9.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('recipeItemShapeless9')"
                    />
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="2">
                <h3 style="margin-bottom: 15px;">&nbsp;</h3>
                <img
                  :src="craftingArrow"
                  style="image-rendering: pixelated; height: auto; width: 80%;"
                />
              </v-col>
              <v-col cols="12" md="5">
                <h3 style="margin-bottom: 15px;">Result</h3>
                <div
                  style="display:grid; grid-template-columns: 1fr 1fr 1fr;
                    grid-template-rows: 1fr 1fr 1fr;
                    grid-gap: 20px;"
                >
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.resultItemShapeless.name"
                      @click="deleteItemSlot('resultItemShapeless')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.resultItemShapeless.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('resultItemShapeless')"
                    />
                  </div>
                  <Slider
                    v-model="recipeObject.data.resultCountShapeless"
                    label="Amount Crafted"
                    max="64"
                    min="1"
                    step="1"
                  />
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-container v-if="recipeObject.data.recipeType === 'Furnace Recipe'">
            <div class="row">
              <v-col cols="12" md="5">
                <div class="crafting-grid">
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.furnaceItem.name"
                      @click="deleteItemSlot('furnaceItem')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.furnaceItem.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('furnaceItem')"
                    />
                  </div>
                  <div style="display: block"></div>
                  <div style="display: block"></div>
                  <div class="empty-grid-slot" style="display: block">
                    <img
                      :src="smeltingFlame"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                    />
                  </div>
                  <div style="display: block">
                      <img
                      :src="craftingArrow"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block">
                    <v-icon
                      class="delete-item"
                      v-if="recipeObject.data.furnaceResult.name"
                      @click="deleteItemSlot('furnaceResult')"
                      title="Delete"
                      >mdi-close</v-icon
                    >
                    <img
                      :src="recipeObject.data.furnaceResult.texture"
                      class="texture-image"
                      style="image-rendering: pixelated; height: 100%; width: 100%;"
                      @click.stop="clickItemSlot('furnaceResult')"
                    />
                  </div>
                  <div class="crafting-grid-slot" style="display: block"></div>
                  <div style="display: block"></div>
                  <div style="display: block"></div>
                </div>
              </v-col>
              <v-col cols="12" md="2">

              </v-col>
              <v-col cols="12" md="4">
                  <Slider
                    v-model="recipeObject.data.experience"
                    label="Experience received"
                    max="100"
                    min="0"
                    step="0.5"
                  />
                  <Slider
                    v-model="recipeObject.data.cookingTime"
                    label="Cooking time (in ticks)"
                    max="1000"
                    min="0"
                    step="1"
                  />
                </v-col>
            </div>
             
          </v-container>
          <!--  -->
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header><h3>Events</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <element-nodes 
            arrayName="recipes" 
            :defaultNodes="defaultNodes" 
            :entryName="name" 
            :projectName="projectName"
            @ready="(graphInstance) => graph = graphInstance"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <BlockItemPickerDialog
      v-model="pickerDialog" 
      :activeProject="projectName"
      @selected-item="addItem"
      @close-selectitemdialog="pickerDialog = false"
    />
  </v-container>
</template>
<script>
import Slider from "../form-components/Slider";
import CraftingArrow from "../../assets/img/crafting-arrow.png";
import SmeltingFlame from "../../assets/img/smelting-flame.png";
import itemPlaceholder from "../../assets/img/item-placeholder.png";
import BlockItemPickerDialog from "../dialogs/BlockItemPickerDialog";
import ElementNodes from '../ElementNodes.vue';
import FormActions, { formActionHandlers } from "../form-components/FormActions";

export default {
  name: "RecipeForm",
  components: { 
    BlockItemPickerDialog, 
    Slider, 
    ElementNodes, 
    FormActions 
  },
  props: ["name", "projectName"],
  data: () => ({
    customItems: [],
    customBlocks: [],
    pickerDialog: false,
    smeltingFlame: SmeltingFlame,
    craftingArrow: CraftingArrow,
    itemPlaceholder: itemPlaceholder,
    selectedItem: "",
    panel: [0],
    valid: false,
    recipeObject: {
      data: {
        recipeType: "Shaped Recipe",
        experience: 0,
        cookingTime: 0,
        recipeItem1: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItem2: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItem3: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItem4: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItem5: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItem6: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItem7: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItem8: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItem9: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItemShapeless1: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItemShapeless2: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItemShapeless3: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItemShapeless4: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItemShapeless5: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItemShapeless6: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItemShapeless7: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItemShapeless8: {
              name: "",
              texture: itemPlaceholder
            },
            recipeItemShapeless9: {
              name: "",
              texture: itemPlaceholder
            },
            resultItem: {
              name: "",
              texture: itemPlaceholder
            },
            resultItemShapeless: {
              name: "",
              texture: itemPlaceholder
            },
        resultCount: 1,
        resultCountShapeless: 1,
        furnaceItem: {
              name: "",
              texture: itemPlaceholder
            },
        furnaceResult: {
              name: "",
              texture: itemPlaceholder
            }
      }
    },
    recipeTypes: [
      "Shaped Recipe",
      "Shapeless Recipe",
      "Furnace Recipe"
    ],
    defaultNodes: ["block/destroy", "block/playerDestroy"],
    graph: null
  }),
  mixins: [formActionHandlers],
  methods: {
    saveEl: function() {
      if (this.recipeObject.data.recipeType === "Shapeless Recipe") {
        let recipeItemsShapeless = [this.recipeObject.data.recipeItemShapeless1,this.recipeObject.data.recipeItemShapeless2,this.recipeObject.data.recipeItemShapeless3,this.recipeObject.data.recipeItemShapeless4,this.recipeObject.data.recipeItemShapeless5,this.recipeObject.data.recipeItemShapeless6,this.recipeObject.data.recipeItemShapeless7,this.recipeObject.data.recipeItemShapeless8,this.recipeObject.data.recipeItemShapeless9]
        let jsonItem = [];
        for (let i = 0; i < recipeItemsShapeless.length; i++) {
          if (recipeItemsShapeless[i].name !== "")
            jsonItem.push(`{"item": "${recipeItemsShapeless[i].name}"}`);
        }
        this.recipeObject.data.shapelessItemJson = jsonItem.join(",");
      }
      else if (this.recipeObject.data.recipeType === "Shaped Recipe") {
        let keyArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
        let recipeItemsShaped = [this.recipeObject.data.recipeItem1,this.recipeObject.data.recipeItem2,this.recipeObject.data.recipeItem3,this.recipeObject.data.recipeItem4,this.recipeObject.data.recipeItem5,this.recipeObject.data.recipeItem6,this.recipeObject.data.recipeItem7,this.recipeObject.data.recipeItem8,this.recipeObject.data.recipeItem9]
        let jsonItem = [];
        for (let i = 0; i < recipeItemsShaped.length; i++) {
          if (recipeItemsShaped[i].name !== "")
            jsonItem.push(`"${keyArray[i]}": {"item": "${recipeItemsShaped[i].name}"}`);
        }
        this.recipeObject.data.shapedItemJson = jsonItem.join(",");
      }
      this.validateRecipe(this.recipeObject).then(value => {
        this.saveElement({
          formData: {
            projectName: this.projectName,
            arrayName: "recipes",
            entryName: this.name,
            data: this.recipeObject
          },
          nodesData: {
            projectName: this.projectName, 
            arrayName: "recipes", 
            entryName: this.name, 
            data: JSON.stringify(this.graph?.serialize())
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
        type: "recipes",
      })
    },
    validateEl: function() {
      if (this.recipeObject.data.recipeType === 'Shaped Recipe') {
        console.log("error");
      } else if (this.recipeObject.data.recipeType === 'Shapeless Recipe') {
        console.log("error2");
      } else {
        console.log("error3")
      }
    },
    clickItemSlot: function(selected) {
      this.pickerDialog = true;
      this.selectedItem = selected;
    },
    deleteItemSlot(selected) {
      this.recipeObject.data[selected] = {
        name: "",
        texture: itemPlaceholder
      };
      this.$forceUpdate();
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
    addItem: function(selected) {
      this.pickerDialog = false;
      this.recipeObject.data[this.selectedItem] = selected;
    },
    help() {
      const url = "https://modfoundry.app/docs/intro";
      this.openHelpLink(url);
    },
  },
  created() {},
  mounted() {
    window.ipc
      .invoke("database", { func: "getProjectDataByName", data: this.projectName })
      .then((result) => {
        this.recipeObject = result.recipes.find((b) => b.name === this.name);

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
  }
};
</script>
