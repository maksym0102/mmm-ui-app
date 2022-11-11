<template>
  <v-container>
    <h2>Mod Elements</h2>
    {{ activeProject }}
    <v-text-field
      label="Filter mod elements"
      v-model="search"
      @input="handleSearch"
      color="accent"
    />
    <!-- <v-checkbox
      v-model="caseSensitive"
      hide-details
      label="Case sensitive search"
      color="accent"
    ></v-checkbox> -->
    <div class="d-flex mt-6 mx-n1">
      <v-btn
        @click="openAll"
        :disabled="allOpened"
        title="Open all"
        class="mx-1 pa-2 grow"
        outlined
        color="accent"
      >
        <v-icon>
          mdi-unfold-more-horizontal
        </v-icon>
        <div class="text-caption">Expand All</div>
      </v-btn>
      <v-btn
        @click="closeAll"
        :disabled="!hasOpened"
        title="Close all"
        class="mx-1 pa-2 grow"
        outlined
        color="accent"
      >
        <v-icon>
          mdi-unfold-less-horizontal
        </v-icon>
        <div class="text-caption">Close all</div>
      </v-btn>
    </div>
    <v-treeview
      ref="tree"
      class="mt-5"
      :active.sync="active"
      :items="items"
      :search="search"
      :filter="filter"
      :open.sync="open"
      activatable
      color="componentmain"
      open-on-click
      transition
      dense
      @update:active="onNodeClicked"
      v-model="selection"
    >
      <template v-slot:label="{item}">
        <div v-if="item.isParent" class="d-flex">
          <v-icon color="accent">
            {{ item.icon }}
          </v-icon>&nbsp;
          <span class="tree-text">{{ item.name }}</span>
        </div>
        <div v-else-if="!item.isParent && item.id < 0">
          <v-icon color="white">
            {{ item.icon }}
          </v-icon>&nbsp;
          <span class="tree-text">{{ item.name }}</span>
        </div>
        <div v-else @contextmenu="handleContextMenu($event, item)">
          <v-icon color="white">
            {{ item.icon }}
          </v-icon>&nbsp;
          <span class="tree-text">{{ item.name }}</span>
        </div>
      </template>
    </v-treeview>
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item class="menu-item" @click="deleteModElementDialog = true">
          <v-list-item-title>Delete the element</v-list-item-title>
        </v-list-item>
        <v-list-item class="menu-item" @click="editElementDialog = true">
          <v-list-item-title>Rename the element</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    
    <!-- The controls at the bottom will only be displayed if the list is taller than the display height. -->
    <div class="bottom-controls d-flex mt-4 mx-n1 text-right" :class="{show: showBottomControls}">
      <!-- 
        The button "Show All" is needed in order to take a space. 
        This way the "Close all" button on top and bottom will have the same size. 
      -->
      <v-btn
        :disabled="true"
        title="Open all"
        class="mx-1 pa-2 grow visibility-hidden"
      >
        <v-icon>
          mdi-unfold-more-horizontal
        </v-icon>
        <div class="text-caption">Show All</div>
      </v-btn>
      <v-btn
        @click="closeAll"
        :disabled="!hasOpened"
        title="Close all"
        class="mx-1 pa-2 grow"
        outlined
        color="accent"
      >
        <v-icon>
          mdi-unfold-less-horizontal
        </v-icon>
        <div class="text-caption">Close all</div>
      </v-btn>
    </div>
    <AddModElementDialog
      :items="items"
      :block-list="blockList"
      :type="newElementType"
      v-model="newElementDialog"
      @submit-addmodelementdialog="addModElement"
    />
    <EditModElementDialog
      :activeItem="activeItem"
      :block-list="blockList"
      v-model="editElementDialog"
      @submit-editmodelementdialog="updateModElement"
    />
    <ConfirmationDialog
      v-model="deleteModElementDialog"
      title="Confirm delete"
      :text="`Are you sure you want to delete ${this.activeItem.name || ''}?`"
      @confirm="deleteModElement"
      @cancel="deleteModElementDialog = false"
    />
  </v-container>
</template>

<script>
import AddModElementDialog from "./dialogs/AddModElementDialog";
import EditModElementDialog from "./dialogs/EditModElementDialog.vue";
import ConfirmationDialog from "./dialogs/ConfirmationDialog";
import placeholder from "../assets/img/placeholder.png";
import itemPlaceholder from "../assets/img/item-placeholder.png";
import { NOTIFICATION_TYPES } from "./NotificationCenter";
import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  ROOT_EVENTS,
  STATUSES,
  NOTIFICATION_ACTIONS,
} from "../modules/constants";

export default {
  components: {
    AddModElementDialog,
    EditModElementDialog,
    ConfirmationDialog
  },
  data: () => ({
    name: "",
    clickedNode: null,
    activeItem: {
      name: '',
      type: ''
    },
    activeItemName: '',
    activeItemType: '',
    active: [],
    open: [],
    users: [],
    search: null,
    caseSensitive: false,
    allOpened: false,
    lastOpen: [],
    currentId: 20,
    newElementType: "",
    newElementDialog: false,
    editElementDialog: false,
    deleteModElementDialog: false,
    selection: [],
    showBottomControls: false,
    icons: {
      items: "mdi-hammer-screwdriver",
      blocks: "mdi-cube",
      biomes: "mdi-image-filter-hdr",
      mobs: "mdi-pig-variant",
      structures: "mdi-city",
      trees: "mdi-pine-tree",
      recipes: "mdi-dots-square",
      loot: "mdi-cube-scan",
      paintings: "mdi-palette",
      tags: "mdi-tag",
      discs: "mdi-disc",
      tools: "mdi-eyedropper-variant",
      armor: "mdi-shield-plus-outline",
      crops: "mdi-image-filter-vintage"
    },
    items: [
      {
        id: 7,
        name: "Items",
        icon: "mdi-hammer-screwdriver",
        isParent: true,
        children: [],
      },
      {
        id: 5,
        name: "Blocks",
        icon: "mdi-cube",
        isParent: true,
        children: [],
      },
      {
        id: 20,
        name: "Tools",
        icon: "mdi-eyedropper-variant",
        isParent: true,
        children: [],
      },
      {
        id: 21,
        name: "Armor",
        icon: "mdi-shield-plus-outline",
        isParent: true,
        children: [],
      },
      // {
      //   id: 0,
      //   name: "Biomes",
      //   icon: "mdi-image-filter-hdr",
      //   isParent: true,
      //   children: [],
      // },
      // {
      //   id: 8,
      //   name: "Mobs",
      //   icon: "mdi-pig-variant",
      //   isParent: true,
      //   children: [],
      // },
      // {
      //   id: 13,
      //   name: "Structures",
      //   icon: "mdi-city",
      //   isParent: true,
      //   children: [],
      // },
      // {
      //   id: 2,
      //   name: "Trees",
      //   icon: "mdi-pine-tree",
      //   isParent: true,
      //   children: [],
      // },
      {
        id: 6,
        name: "Recipes",
        icon: "mdi-dots-square",
        isParent: true,
        children: [],
      },
      // {
      //   id: 14,
      //   name: "Advancements",
      //   icon: "mdi-arrow-right",
      //   isParent: true,
      //   children: [],
      // },
      // {
      //   id: 15,
      //   name: "GUIs",
      //   icon: "mdi-view-quilt",
      //   isParent: true,
      //   children: [],
      // },
      {
        id: 16,
        name: "Paintings",
        icon: "mdi-palette",
        isParent: true,
        children: [],
      },
      {
        id: 17,
        name: "Tags",
        icon: "mdi-tag",
        isParent: true,
        children: [],
      },
      // {
      //   id: 18,
      //   name: "Discs",
      //   icon: "mdi-disc",
      //   isParent: true,
      //   children: [],
      // },
      {
        id: 19,
        name: "Loot",
        icon: "mdi-cube-scan",
        isParent: true,
        children: [],
      },
      {
        id: 22,
        name: "Crops",
        icon: "mdi-image-filter-vintage",
        isParent: true,
        children: [],
      },
    ],
    blockList: [],
    showMenu: false,
    x: 0,
    y: 0,
    menuItems: ["Delete the element", "Rename the element"]
  }),
  props: ["activeProject"],
  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    },
    selected() {
      if (!this.active.length) return undefined;

      const id = this.active[0];

      for (const parent of this.items) {
        if (parent.id === id) return parent;
        for (const child of parent.children) if (child.id === id) return child;
      }
      return null;
    },
    hasOpened() {
      return this.open.length > 0;
    },
  },

  watch: {
    selection(newValue) {
      console.log(newValue);
    },
    open(opened) {
      this.allOpened = Boolean(opened.length === this.items.length);
      if (this.hasOpened) {
        setTimeout(() => {
          const navContainer = this.$el.parentElement;
          this.showBottomControls =
            this.hasOpened &&
            navContainer.scrollHeight > navContainer.clientHeight;
        }, 500);
      } else {
        this.showBottomControls = false;
      }
    },
  },
  created() {
    this.fetchProjects();
  },
  mounted() {
    this.$root.$on("close-addmodelementdialog", this.handleAddElementDialog);
    this.$root.$on("close-editmodelementdialog", this.handleEditElementDialog);
    this.$root.$on("delete-element", this.handledeleteModElement);
  },
  beforeDestroy() {
    this.$root.$off("close-addmodelementdialog", this.handleAddElementDialog);
    this.$root.$off("close-editmodelementdialog", this.handleEditElementDialog);
    this.$root.$off("delete-element", this.handledeleteModElement);
  },
  methods: {
    handleAddElementDialog() {
      this.newElementDialog = false;
    },
    handleEditElementDialog() {
      this.editElementDialog = false;
    },
    handledeleteModElement(args) {
      let elementParent = this.items.find(
        (i) => i.name.toLowerCase() === args.type
      );
      elementParent.children = elementParent.children.filter(
        (item) => item.name !== args.name
      );
    },
    handleContextMenu(e, item) {
      e.preventDefault();
      this.showMenu = false;
      this.activeItem = item;
      this.activeItemName = item.name;
      this.activeItemType = item.type;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    addModElement: async function(name) {
      const newElementType = this.ucFirst(this.getTypeFromNodeObject());
      const newItemParent = this.items.find((i) => i.name === newElementType);

      this.newElementDialog = false;
      this.currentId++;

      let newNode = {
        id: Date.now(),
        name: name,
        icon: this.icons[this.clickedNode.type],
        type: this.clickedNode.type,
        changes: false,
        data: this.makeElementDataByType(this.clickedNode.type),
      };

      await window.ipc.invoke("database", {
        func: "addModElement",
        data: { node: newNode, projectName: this.activeProject },
      });

      newItemParent.children.unshift(newNode);

      this.$root.$emit("node-clicked", newNode);
      this.updateBlockList();
    },
    updateModElement: async function(name) {
      this.editElementDialog = false;

      let updateData = {
        projectName: this.activeProject,
        arrayName: this.activeItem.type,
        entryName: this.activeItem.name,
        data: {
          ...this.activeItem,
          name: name
        },
      }

      const { status, ...response } =  await window.ipc.invoke(IPC_HANDLERS.DATABASE, { func: IPC_FUNCTIONS.UPDATE_PROJECT_ARRAY_ENTRY, data: updateData });
      const parentItem = this.items.find((i) => i.name === this.ucFirst(this.activeItem.type));
      const children = parentItem.children;
      for (let i in children) {
        if (children[i].name === this.activeItem.name) {
          this.activeItem.name = name;
          break;
        }
      }
      this.updateBlockList();
    },
    deleteModElement: async function() {
      if (this.activeItem.name === '' || this.activeItem.type === '') return;

      const type = this.activeItem.type;
      const name = this.activeItem.name;

      const args = {
        projectName: this.activeProject,
        arrayName: type,
        entryName: name,
      };
      const { status, ...response } = await window.ipc.invoke(
        IPC_HANDLERS.DATABASE,
        {
          func: IPC_FUNCTIONS.REMOVE_MOD_ELEMENT,
          data: args,
        }
      );

      this.$root.$emit(ROOT_EVENTS.DELETE_ELEMENT, {
        name,
        type,
      });
      this.$root.$emit(ROOT_EVENTS.DELETE_ELEMENT, {
        name,
        type,
      });
      if (status === STATUSES.SUCCESS) {
        this.$root.$emit(NOTIFICATION_ACTIONS.PUSH, {
          type: NOTIFICATION_TYPES.SUCCESS,
          timer: null,
          message: `${name} has been deleted`,
        });
      } else {
        this.$root.$emit(NOTIFICATION_ACTIONS.PUSH, {
          type: NOTIFICATION_TYPES.ERROR,
          timer: null,
          message: `${name} could not be deleted. Try again later`,
        });
        console.error(response.message);
      }
      this.deleteModElementDialog = false;
    },
    onNodeClicked: function(node) {
      if (this.active.length === 0) return;

      const clickedNode = this.findById(node[0], this.items);

      if (node[0] < 0) {
        const elementType = this.removeTrailingSLetter(
          this.getTypeFromNodeObject(clickedNode)
        );
        this.newElementType = this.ucFirst(elementType);
        this.newElementDialog = true;
        this.clickedNode = clickedNode;
      } else {
        this.$root.$emit("node-clicked", this.selected);
      }
      this.active = [];
    },
    fetchProjects: function() {
      window.ipc
        .invoke("database", {
          func: "getProjectDataByName",
          data: this.activeProject,
        })
        .then((result) => {
          this.loadModElements(result);
        });
    },
    makeElementDataByType: function(elementType) {
      let data;
      switch (elementType) {
        case "blocks":
          data = {
            inGameName: "",
            material: "STONE",
            sound: "STONE",
            hardness: 1,
            blockType: "Cube",
            resistance: 1,
            jumpFactor: 1,
            friction: 1,
            speedFactor: 1,
            hasCollision: true,
            isValidSpawn: true,
            isRedstoneConductor: false,
            isSuffocating: true,
            requiresCorrectToolForDrop: false,
            cube1: { src: placeholder, name: "placeholder.png" },
            cube2: { src: placeholder, name: "placeholder.png" },
            cube3: { src: placeholder, name: "placeholder.png" },
            cube4: { src: placeholder, name: "placeholder.png" },
            cube5: { src: placeholder, name: "placeholder.png" },
            cube6: { src: placeholder, name: "placeholder.png" },
            lootTable: null,
            renderType: {name: "Solid", val: "solid"},
          };
          break;
        case "biomes":
          data = {
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
          };
          break;
        case "items":
          data = {
            itemTexture: { src: itemPlaceholder, name: "item-placeholder.png" },
            inGameName: "",
            creativeTab: "Misc",
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
          };
          break;
        case "recipes":
          data = {
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
            furnaceItem: {
              name: "",
              texture: itemPlaceholder
            },
            furnaceResult: {
              name: "",
              texture: itemPlaceholder
            },
            resultCount: 1,
          };
          break;
        case "mobs":
          data = {
            inGameName: "",
            health: 20,
            experience: 5,
            model: "Axolotl",
            mobTexture: placeholder,
            customModel: "",
          };
          break;
        case "structures":
          data = {
            biomes: [],
            offset: 0,
            probability: 50,
            customModel: "",
          };
          break;
        case "paintings":
          data = {
            width: 16,
            height: 16,
            texture: { src: itemPlaceholder, name: "ItemPlaceholder" },
          };
          break;
        case "tags":
          data = {
            items: [],
          };
          break;
        case "discs":
          data = {
            image: { src: placeholder, name: "placeholder" },
            sound: { name: "", src: "" },
          };
          break;
        case "loot":
          data = {
            lootTableJSON: "",
          };
          break;
        case "tools":
          data = {
            itemTexture: { src: itemPlaceholder, name: "ItemPlaceholder" },
          };
          break;
        case "armor":
          data = {
            layer1Texture: {
              src: itemPlaceholder,
              name: "ItemPlaceholder",
            },
            layer2Texture: {
              src: itemPlaceholder,
              name: "ItemPlaceholder",
            },
            helmetTexture: {
              src: itemPlaceholder,
              name: "ItemPlaceholder",
            },
            chestplateTexture: {
              src: itemPlaceholder,
              name: "ItemPlaceholder",
            },
            leggingTexture: {
              src: itemPlaceholder,
              name: "ItemPlaceholder",
            },
            bootTexture: {
              src: itemPlaceholder,
              name: "ItemPlaceholder",
            },
            repairItem: {
              name: "",
              texture: itemPlaceholder
            }
          };
          break;
        case "crops":
          data = {
            inGameName: "",
            stages: [],
            harvestItem: {
              name: "",
              texture: itemPlaceholder
            },
            seedItem: {
              name: "",
              texture: itemPlaceholder
            }
          };
          break;
        default:
          break;
      }
      return data;
    },
    loadModElements: function(result) {
      for (let i = 0; i < this.items.length; i++) {
        let typeName = this.items[i].name.toLowerCase();
        for (let j = 0; j < result[typeName]?.length; j++) {
          this.items[i].children.push(result[typeName][j]);
        }
        this.items[i].children.push({
          id: -1 - i,
          name: "Add New +",
          type: typeName,
        });
      }
      this.updateBlockList();
    },
    updateBlockList() {
      this.blockList = this.items.map((item) => ({
        type: item.name,
        list: item.children
          .filter((children) => children.id >= 0 && children.name)
          .map((children) => children.name),
      }));
    },
    findById: function(id, array) {
      for (const parent of array) {
        if (parent.id === id) {
          return parent;
        } else if ("children" in parent) {
          const result = this.findById(id, parent.children);
          if (result) return result;
        }
      }

      return null;
    },
    generateId: function() {
      return (
        Math.random()
          .toString(36)
          .substring(2) + new Date().getTime().toString(36)
      );
    },
    handleSearch: function(val) {
      if (val) {
        if (!this.allOpened) {
          this.lastOpen = this.open;
          this.allOpened = true;
          this.$refs.tree.updateAll(true);
        }
      } else {
        this.$refs.tree.updateAll(false);
        this.allOpened = false;
        this.open = this.lastOpen;
      }
    },
    getTypeFromNodeObject(node = this.clickedNode) {
      return node.type;
    },
    ucFirst(string) {
      return string[0].toUpperCase() + string.slice(1);
    },
    removeTrailingSLetter(string) {
      return string.replace(/s$/, "");
    },
    openAll() {
      this.allOpened = true;
      this.$refs.tree.updateAll(true);
    },
    closeAll() {
      this.allOpened = false;
      this.$refs.tree.updateAll(false);
    },
  },
};
</script>

<style scoped>
.visibility-hidden {
  visibility: hidden;
}

.bottom-controls {
  opacity: 1;
  transition: opacity 0.35s, visibility 0s;
}

.bottom-controls:not(.show) {
  opacity: 0;
  visibility: hidden;
  transition-delay: 0s, 0.35s;
}

.tree-text {
  white-space: initial;
  word-wrap: break-word;
}
</style>
