<template>
  <v-container class="content-wrapper">
    <form-actions :name="name" :type="'Biome'" @save="saveEl" @delete="deleteEl" @help="help" />
    <v-form v-model="valid">
      <v-container>
        <v-expansion-panels multiple v-model="panel">
          <!-- Generation Settings -->
          <v-expansion-panel>
            <v-expansion-panel-header
              ><h3>Generation</h3></v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    :value="surfaceBuilderTypes[0]"
                    v-model="biomeObject.data.surfaceBuilderType"
                    :items="surfaceBuilderTypes"
                    dense
                    filled
                    label="Surface Builder Type"
                    color="accent"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    v-model="biomeObject.data.topMaterial"
                    :items="allBlocks"
                    dense
                    filled
                    label="Top Material"
                    color="accent"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" md="4">
                  <v-autocomplete
                    v-model="biomeObject.data.underMaterial"
                    :items="allBlocks"
                    dense
                    filled
                    label="Under Material"
                    color="accent"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" md="4">
                  <v-autocomplete
                    v-model="biomeObject.data.underWaterMaterial"
                    :items="allBlocks"
                    dense
                    filled
                    label="Under Water Material"
                    color="accent"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    v-model="biomeObject.data.precipitation"
                    :items="precipitationTypes"
                    dense
                    filled
                    label="Precipitation"
                    color="accent"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="biomeObject.data.depth"
                    label="Depth"
                    max="20"
                    min="1"
                    step="0.05"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="biomeObject.data.scale"
                    label="Scale"
                    max="20"
                    min="1"
                    step="0.05"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="biomeObject.data.downfall"
                    label="Downfall"
                    min="0"
                    max="1"
                    step="0.05"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <Slider
                    v-model="biomeObject.data.temperature"
                    label="Temperature"
                    max="2"
                    min="-1"
                    step="0.1"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="biomeObject.data.carvers"
                    :items="carverTypes"
                    label="Carvers"
                    multiple
                    chips
                    hint="Air and liquid carvers"
                    persistent-hint
                    color="accent"
                    item-color="accent"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="biomeObject.data.starts"
                    :items="startTypes"
                    label="Starts"
                    multiple
                    chips
                    hint="Structures to generate"
                    persistent-hint
                    color="accent"
                    item-color="accent"
                  ></v-select>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Color Settings -->
          <v-expansion-panel>
            <v-expansion-panel-header><h3>Colors</h3></v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" md="3">
                  Fog Color
                  <v-color-picker
                    dot-size="20"
                    swatches-max-height="100"
                    v-model="biomeObject.data.fogColor"
                    mode="hexa"
                  ></v-color-picker>
                </v-col>
                <v-col cols="12" md="3">
                  Foliage Color
                  <v-color-picker
                    dot-size="20"
                    swatches-max-height="100"
                    v-model="biomeObject.data.foliageColor"
                    mode="hexa"
                  ></v-color-picker>
                </v-col>
                <v-col cols="12" md="3">
                  Grass Color
                  <v-color-picker
                    dot-size="20"
                    swatches-max-height="100"
                    v-model="biomeObject.data.grassColor"
                    mode="hexa"
                  ></v-color-picker>
                </v-col>
                <v-col cols="12" md="3">
                  Sky Color
                  <v-color-picker
                    dot-size="20"
                    swatches-max-height="100"
                    v-model="biomeObject.data.skyColor"
                    mode="hexa"
                  ></v-color-picker>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="3">
                  Water Color
                  <v-color-picker
                    dot-size="20"
                    swatches-max-height="100"
                    v-model="biomeObject.data.waterColor"
                    mode="hexa"
                  ></v-color-picker>
                </v-col>
                <v-col cols="12" md="3">
                  Water Fog Color
                  <v-color-picker
                    dot-size="20"
                    swatches-max-height="100"
                    v-model="biomeObject.data.waterFogColor"
                    mode="hexa"
                  ></v-color-picker>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Entity Settings -->
          <v-expansion-panel>
            <v-expansion-panel-header
              ><h3>Entities</h3></v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-row>
                <v-col
                  v-for="mob in biomeObject.data.entities"
                  :key="mob.name"
                  cols="12"
                  md="3"
                >
                  <v-sheet outlined color="accent" rounded>
                    <v-card class="pr-5 pl-5 pb-3">
                      <v-card-title>
                        {{ mob.name }}
                      </v-card-title>
                      <Slider
                        v-model="mob.weight"
                        label="Weight"
                        max="100"
                        min="0"
                        step="1"
                      />
                      <Slider
                        v-model="mob.minCount"
                        label="Min Count"
                        max="50"
                        min="0"
                        step="1"
                      />
                      <Slider
                        v-model="mob.maxCount"
                        label="Max Count"
                        max="50"
                        min="0"
                        step="1"
                      />
                    </v-card>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header><h3>Events</h3></v-expansion-panel-header>
            <v-expansion-panel-content>
              <element-nodes
                arrayName="biomes"
                :defaultNodes="defaultNodes"
                :entryName="name"
                :projectName="projectName"
                @ready="(graphInstance) => (graph = graphInstance)"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
import Slider from "../form-components/Slider";
import blocks from "../../assets/data/blocks_list_117.json";
import ElementNodes from "../ElementNodes.vue";
import FormActions, {
  formActionHandlers,
} from "../form-components/FormActions";

export default {
  name: "BiomeForm",
  components: { Slider, ElementNodes, FormActions },
  props: ["name", "projectName"],
  data: () => ({
    panel: [0],
    biomeObject: {
      data: {
        surfaceBuilderType: "Default",
        topMaterial: "minecraft:grass",
        underMaterial: "minecraft:stone",
        underWaterMaterial: "minecraft:stone",
        precipitation: "None",
        depth: 1.25,
        scale: 5,
        downfall: 0.05,
        temperature: 2,
        fogColor: "#C5C7C9",
        foliageColor: "#19573D",
        grassColor: "#186318",
        skyColor: "#4975C0",
        waterColor: "#1A2885",
        waterFogColor: "#6590EC",
        entities: [
          {
            name: "Axolotl",
            weight: 0,
            minCount: 0,
            maxCount: 0,
          },
          {
            name: "Bat",
            weight: 0,
            minCount: 0,
            maxCount: 0,
          },
          {
            name: "Bee",
            weight: 0,
            minCount: 0,
            maxCount: 0,
          },
          {
            name: "Blaze",
            weight: 0,
            minCount: 0,
            maxCount: 0,
          },
          {
            name: "Cat",
            weight: 0,
            minCount: 0,
            maxCount: 0,
          },
          {
            name: "Cave Spider",
            weight: 0,
            minCount: 0,
            maxCount: 0,
          },
          {
            name: "Chicken",
            weight: 0,
            minCount: 0,
            maxCount: 0,
          },
          {
            name: "Cod",
            weight: 0,
            minCount: 0,
            maxCount: 0,
          },
          {
            name: "Cow",
            weight: 0,
            minCount: 0,
            maxCount: 0,
          },
        ],
        carvers: [],
        starts: [],
      },
    },
    valid: false,
    biomeData: null,
    allBlocks: blocks.blocks,
    surfaceBuilderTypes: [
      "Default",
      "Mountain",
      "Shattered Savanna",
      "Gravelly Mountain",
      "Giant Tree Taiga",
      "Swamp",
      "Badlands",
      "Soul Sand Valley",
      "Basalt Deltas",
      "Frozen Ocean",
      "Nether",
      "Nether Forest",
      "Wooded Badlands",
      "Eroded Badlands",
      "Nope",
    ],
    precipitationTypes: ["None", "Rain", "Snow"],
    carverTypes: [
      "Cave",
      "Nether_Cave",
      "Canyon",
      "Underwater_Canyon",
      "Underwater_Cave",
    ],
    startTypes: [
      "Bastion Remnant",
      "Buried Treasure",
      "Desert Pyramid",
      "Endcity",
      "Fortress",
      "Igloo",
      "Jungle Pyramid",
      "Mansion",
      "Mineshaft",
      "Monument",
      "Nether Fossil",
      "Ocean Ruin",
      "Pillager Outpost",
      "Ruined Portal",
      "Shipwreck",
      "Stronghold",
      "Swamp Hut",
      "Village",
    ],
    defaultNodes: ["block/destroy", "block/playerDestroy"],
    graph: null,
  }),
  mixins: [formActionHandlers],
  methods: {
    saveEl() {
      this.saveElement({
        formData: {
          projectName: this.projectName,
          arrayName: "biomes",
          entryName: this.name,
          data: this.biomeObject,
        },
        nodesData: {
          projectName: this.projectName,
          arrayName: "biomes",
          entryName: this.name,
          data: JSON.stringify(this.graph?.serialize()),
        },
      });
    },
    deleteEl() {
      this.deleteElement({
        projectName: this.projectName,
        name: this.name,
        type: "biomes",
      });
    },
    fetchData: function() {
      window.ipc
        .invoke("database", {
          func: "getProjectDataByName",
          data: this.projectName,
        })
        .then((result) => {
          this.biomeObject = result.biomes.find((b) => b.name === this.name);
          result.blocks.forEach((block) => {
            if (block.data.inGameName) {
              let blockRegistryName = block.data.inGameName
                .replace(" ", "_")
                .toLowerCase();
              this.allBlocks.unshift("generatedmod:" + blockRegistryName);
            }
          });
        });
    },
    makeEmptyBiomeData: function() {
      let data = {
        surfaceBuilderType: "Default",
        topMaterial: "minecraft:grass",
        underMaterial: "minecraft:stone",
        underWaterMaterial: "minecraft:stone",
        precipitation: "None",
        depth: 1.25,
        scale: 5,
        downfall: 0.05,
        temperature: 2,
        fogColor: "#C5C7C9",
        foliageColor: "#19573D",
        grassColor: "#186318",
        skyColor: "#4975C0",
        waterColor: "#1A2885",
        waterFogColor: "#6590EC",
      };
      return data;
    },
    makeEmptyEntities: function() {
      return [
        {
          name: "Axolotl",
          weight: 0,
          minCount: 0,
          maxCount: 0,
        },
        {
          name: "Bat",
          weight: 0,
          minCount: 0,
          maxCount: 0,
        },
        {
          name: "Bee",
          weight: 0,
          minCount: 0,
          maxCount: 0,
        },
        {
          name: "Blaze",
          weight: 0,
          minCount: 0,
          maxCount: 0,
        },
        {
          name: "Cat",
          weight: 0,
          minCount: 0,
          maxCount: 0,
        },
        {
          name: "Cave Spider",
          weight: 0,
          minCount: 0,
          maxCount: 0,
        },
        {
          name: "Chicken",
          weight: 0,
          minCount: 0,
          maxCount: 0,
        },
        {
          name: "Cod",
          weight: 0,
          minCount: 0,
          maxCount: 0,
        },
        {
          name: "Cow",
          weight: 0,
          minCount: 0,
          maxCount: 0,
        },
      ];
    },
    help() {
      const url = "https://modfoundry.app/docs/intro";
      this.openHelpLink(url);
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
