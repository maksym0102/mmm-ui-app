<template>
  <v-container class="content-wrapper">
    <form-actions
      :name="name"
      :type="'Item'"
      @save="save"
      @delete="deleteElement({ projectName, name, type: 'items' })"
      @help="help"
    />
    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header><h3>General</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form ref="itemForm">
            <v-container>
              <!-- <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    dense
                    filled
                    disabled
                    outlined
                    label="Registry name"
                    v-model="registryName"
                    color="accent"
                  ></v-text-field>
                </v-col>
              </v-row> -->
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    dense
                    filled
                    label="In Game Name"
                    color="accent"
                    v-model="itemObject.data.inGameName"
                    required
                    :rules="nameRules"
                  >
                    <slot slot="append" name="tooltip">
                      <Tooltip :text="tooltipTitle('ItemForm.InGameName')" />
                    </slot>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    :items="creativeTabs"
                    item-text="name"
                    item-value="val"
                    label="Creative Tab"
                    persistent-hint
                    item-color="accent"
                    filled
                    color="accent"
                    v-model="itemObject.data.creativeTab"
                  >
                    <slot slot="append" name="tooltip">
                      <Tooltip :text="tooltipTitle('ItemForm.CreativeTab')" />
                    </slot>
                  </v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="itemObject.data.stackSize"
                    label="Stack Size"
                    max="999"
                    min="1"
                    step="1"
                  >
                    <template slot="tooltip-component">
                      <component :is="tooltip_component" :text="tooltipTitle('ItemForm.StackSize')"></component>
                    </template>
                  </Slider>
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
                <h4>Item texture</h4>
                <v-img
                  @click.stop="pickerDialog = true"
                  :src="itemObject.data.itemTexture.src"
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
        <v-expansion-panel-header><h3>Tags</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="itemObject.data.tags"
                    :items="itemTags"
                    multiple
                    dense
                    chips
                    label="Add item to vanilla tag groups"
                    color="accent"
                    item-color="accent"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-container>
        <v-checkbox
          v-model="itemObject.data.isFood"
          :label="'Is this item food?'"
          color="accent"
        ></v-checkbox>
      </v-container>

      <v-expansion-panel v-if="itemObject.data.isFood">
        <v-expansion-panel-header><h3>Food</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="12" md="6" lg="4">
              <Slider
                v-model="itemObject.data.nutrition"
                label="Nutrition"
                max="20"
                min="1"
                step="1"
              >
                <template slot="tooltip-component">
                  <component :is="tooltip_component" :text="tooltipTitle('ItemForm.Nutrition')"></component>
                </template>
              </Slider>
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <Slider
                v-model="itemObject.data.saturation"
                label="Saturation"
                max="20"
                min="1"
                step="0.1"
              >
                <template slot="tooltip-component">
                  <component :is="tooltip_component" :text="tooltipTitle('ItemForm.Saturation')"></component>
                </template>
              </Slider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6" lg="4">
              <v-checkbox
                v-model="itemObject.data.isMeat"
                :label="'Is meat?'"
                color="accent"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-checkbox
                v-model="itemObject.data.fastFood"
                :label="'Can be eaten fast?'"
                color="accent"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-checkbox
                v-model="itemObject.data.useEffects"
                :label="'Apply effects when eaten?'"
                color="accent"
              ></v-checkbox>
            </v-col>
          </v-row>
          <template v-if="itemObject.data.useEffects">
            <v-row
              v-for="(effect, index) in itemObject.data.effects"
              :key="effect.id"
            >
              <v-col cols="12">
                Effect {{ effect.name ? `${effect.name}` : index + 1 }}
              </v-col>
              <v-col cols="12" md="6" lg="2" xl="3">
                <v-select
                  :items="mobEffects"
                  label="Effect applied"
                  persistent-hint
                  item-color="accent"
                  filled
                  color="accent"
                  v-model="effect.name"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" lg="2" xl="3">
                <v-text-field
                  dense
                  filled
                  label="Effect duration"
                  type="number"
                  suffix="ticks"
                  color="accent"
                  v-model="effect.duration"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="5" lg="3" xl="2">
                <Slider
                  v-model="effect.probability"
                  label="Probability of effect"
                  max="1"
                  min="0"
                  step="0.01"
                />
              </v-col>
              <v-col cols="12" md="5" lg="3" xl="2">
                <Slider
                  v-model="effect.amplifier"
                  label="Effect amplifier"
                  max="127"
                  min="0"
                  step="1"
                />
              </v-col>
              <v-col
                cols="12"
                md="2"
                lg="1"
                align-self="center"
                class="ml-auto"
              >
                <confirmation-component
                  buttonTitle="Remove effect"
                  title="Delete effect"
                  :text="
                    `Are you sure you want to delete ${effect.name ||
                      ''} effect?`
                  "
                  @confirm="removeEffect(effect)"
                />
              </v-col>
              <v-col
                v-if="index < itemObject.data.effects.length - 1"
                cols="12"
              >
                <v-divider />
              </v-col>
            </v-row>
            <v-divider />
            <v-btn width="100%" class="mt-4" @click="addEffect">
              + Add effect
            </v-btn>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- <v-container>
        <v-checkbox
          v-model="itemObject.data.isTool"
          :label="'Is this item a tool?'"
          color="accent"
        ></v-checkbox>
      </v-container> -->
      <v-expansion-panel v-if="itemObject.data.isTool">
        <v-expansion-panel-header><h3>Tool</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="12" md="4">
              <Slider
                v-model="itemObject.data.harvestLevel"
                label="Harvest Level"
                max="20"
                min="1"
                step="1"
              />
            </v-col>
            <v-col cols="12" md="4">
              <Slider
                v-model="itemObject.data.efficiency"
                label="Efficiency"
                max="20"
                min="1"
                step="1"
              />
            </v-col>
            <v-col cols="12" md="4">
              <Slider
                v-model="itemObject.data.meleeDamage"
                label="Melee Damage"
                min="0.1"
                step="0.1"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <h3>Events</h3>
      <p class="text-caption"
        >The nodes below can be used to control the behavior of this item</p
      >
      <element-nodes
        arrayName="items"
        :defaultNodes="defaultNodes"
        :entryName="name"
        :projectName="projectName"
        @ready="(graphInstance) => (graph = graphInstance)"
      />
    <TexturePickerDialog
      v-model="pickerDialog"
      v-bind:activeProject="projectName"
      @selected-texture="onTextureSelect"
    />
  </v-container>
</template>
<script>
import Slider from "../form-components/Slider";
import ItemPlaceholder from "../../assets/img/item-placeholder.png";
import TexturePickerDialog from "../dialogs/TexturePickerDialog";
import { v4 as uuid } from "uuid";
import ElementNodes from "../ElementNodes";
import ConfirmationComponent from "../form-components/ConfirmationComponent";
import tags from "../../assets/data/item_tags_118.json";
import FormActions, { formActionHandlers } from "../form-components/FormActions";
import Tooltip from "../utility/Tooltip.vue";


export default {
  name: "ItemForm",
  components: {
    Slider,
    TexturePickerDialog,
    ElementNodes,
    ConfirmationComponent,
    FormActions,
    Tooltip
},
  props: ["name", "projectName"],
  data: () => ({
    tooltip_component: 'Tooltip',
    selectedTexture: "",
    panel: [0],
    pickerDialog: false,
    valid: false,
    itemTags: tags.tags,
    nameRules: [
        (v) => !!v || "Name is required",
    ],
    itemObject: {
      data: {
        itemTexture: {
          src: ItemPlaceholder,
          name: "item-placeholder.png",
        },
        inGameName: "",
        creativeTab: "TAB_MISC",
        texture: null,
        isFood: false,
        isTool: false,
        stackSize: 64,
        nutrition: 1,
        saturation: 0.5,
        harvestLevel: 2,
        efficiency: 5,
        meleeDamage: 10,
        isMeat: false,
        fastFood: false,
        useEffects: false,
        effects: [],
        tags: [],
      },
    },
    creativeTabs: [
      {name: "Building Blocks", val: "TAB_BUILDING_BLOCKS"},
      {name: "Decorations", val: "TAB_DECORATIONS"},
      {name: "Redstone", val: "TAB_REDSTONE"},
      {name: "Transportation", val: "TAB_TRANSPORTATION"},
      {name: "Misc", val: "TAB_MISC"},
      {name: "Food", val: "TAB_FOOD"},
      {name: "Tools", val: "TAB_TOOLS"},
      {name: "Combat", val: "TAB_COMBAT"},
      {name: "Brewing", val: "TAB_BREWING"},
      {name: "Materials", val: "TAB_MATERIALS"}
    ],
    mobEffects: [
      "MOVEMENT_SPEED",
      "MOVEMENT_SLOWDOWN",
      "DIG_SPEED",
      "DIG_SLOWDOWN",
      "DAMAGE_BOOST",
      "HEAL",
      "HARM",
      "JUMP",
      "CONFUSION",
      "REGENERATION",
      "DAMAGE_RESISTANCE",
      "FIRE_RESISTANCE",
      "WATER_BREATHING",
      "INVISIBILITY",
      "BLINDNESS",
      "NIGHT_VISION",
      "HUNGER",
      "WEAKNESS",
      "POISON",
      "WITHER",
      "HEALTH_BOOST",
      "ABSORPTION",
      "SATURATION",
      "GLOWING",
      "LEVITATION",
      "LUCK",
      "UNLUCK",
      "SLOW_FALLING",
      "CONDUIT_POWER",
      "DOLPHINS_GRACE",
      "BAD_OMEN",
      "HERO_OF_THE_VILLAGE",
    ],
    defaultNodes: ["item/onDroppedByPlayer", "item/hurtEnemy", "item/useOn", "item/onCraftedBy"],
    graph: null,
  }),
  computed: {
    url() {
      if (!this.texture) return;
      return URL.createObjectURL(this.texture);
    },
    registryName() {
      return this.itemObject.data.inGameName.replace(/ /g, "_").toLowerCase();
    },
    formData() {
      return {};
    },
    nodesData() {
      return {};
    },
    
  },
  mixins: [formActionHandlers],
  methods: {
    save: function() {
      this.validateElement({formRef: this.$refs.itemForm}).then(value => {
        // TODO: fix error here (cannot read property 'runStep' of undefined)
        this.graph?.getNodeDictionary();
        //this.graph.runStep(1);
        this.itemObject.data.javaImports = this.graph.javaImports;
        this.itemObject.data.nodeDictionary = this.graph.serializeNodeDictionary();
        this.itemObject.data.registryName = this.registryName;
        
        console.log(this.itemObject.data.nodeDictionary);

        const formData = {
          projectName: this.projectName,
          arrayName: "items",
          entryName: this.name,
          data: {
            ...this.itemObject,
            data: {
              ...this.itemObject.data,
              effects: this.getValidEffects(),
            },
          },
        };

        const nodesData = {
          projectName: this.projectName,
          arrayName: "items",
          entryName: this.name,
          data: JSON.stringify(this.graph?.serialize()),
        };

        this.saveElement({
          formData,
          nodesData
        })
      }, reason => {
          console.log(reason);
      });
      
    },
    help() {
      const url = "https://modfoundry.app/docs/mod-elements/how-to-make-an-item";
      this.openHelpLink(url);
    },
    getValidEffects() {
      return this.itemObject.data.effects.filter((effect) => effect.name);
    },
    onTextureSelect(selected) {
      this.pickerDialog = false;
      this.itemObject.data.itemTexture = selected;
    },
    handlePickerDialogClose() {
      this.pickerDialog = false;
    },
    addEffect() {
      this.itemObject.data.effects.push({
        id: uuid(),
        name: null,
        duration: null,
        probability: null,
        amplifier: null,
      });
    },
    removeEffect(effect) {
      this.itemObject.data.effects = this.itemObject.data.effects.filter(
        (e) => e !== effect
      );
    },
  },
  async mounted() {
    window.ipc
      .invoke("database", {
        func: "getProjectDataByName",
        data: this.projectName,
      })
      .then((result) => {
        this.itemObject = result.items.find((b) => b.name === this.name);
      });

    this.$root.$on("close-selecttexturedialog", this.handlePickerDialogClose);
  },
  beforeDestroy() {
    this.$root.$off("close-selecttexturedialog", this.handlePickerDialogClose);
  },
};
</script>
