<template>
  <v-card>
    <v-tabs
      dark
      background-color="blue-grey darken-4"
      show-arrows
      height="30"
      v-model="activeModel"
      class="fixed-tabs-bar"
      v-if="openTabs.length"
    >
      <v-tabs-slider color="accent"></v-tabs-slider>

      <v-tab
        v-for="item in openTabs"
        :key="item.name"
        class="pr-0 white--text"
        color="accent"
        active-class=""
        @click="setActiveTab(item)"
      >
        <template class="white--text text-capitalize">
            <v-icon>
              {{ item.icon }}
            </v-icon>
            &nbsp;
            {{ item.name }}
            <div v-if="item.changes">*</div>
            <v-btn plain width="10" class="px-0" @click="closeTab(item.id)">
                <v-icon
                dark
                small
                width="10"
                >mdi-close</v-icon>
            </v-btn>
        </template>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="activeModel" style="background-color: #232323;">
      <v-tab-item
        v-for="item in openTabs"
        :key="item.id"
        style="height: 100%"
        :transition="false"
      >
        <BlockForm 
          key="blocks"
          v-if="activeTab.type === 'blocks' && item.type ==='blocks'" 
          :name="activeTab.name" 
          :activeProject="activeProject"
        />
        <BiomeForm 
          key="biomes"
          v-if="activeTab.type === 'biomes' && item.type ==='biomes'" 
          :name="activeTab.name" 
          :projectName="activeProject"
        />
        <ItemForm 
          key="items"
          v-if="activeTab.type === 'items' && item.type ==='items'" 
          :name="activeTab.name" 
          :projectName="activeProject"
        />
        <RecipeForm 
          key="recipes"
          v-if="activeTab.type === 'recipes' && item.type ==='recipes'" 
          :name="activeTab.name" 
          :projectName="activeProject"
        />
        <MobForm 
          key="mobs"
          v-if="activeTab.type === 'mobs' && item.type ==='mobs'" 
          :name="activeTab.name" 
          :projectName="activeProject"
        />
        <StructureForm 
          key="structures"
          v-if="activeTab.type === 'structures' && item.type ==='structures'" 
          :name="activeTab.name" 
          :projectName="activeProject"
        />
        <PaintingForm 
          key="paintings"
          v-if="activeTab.type === 'paintings' && item.type === 'paintings'" 
          :name="activeTab.name" 
          :projectName="activeProject"
        />
        <TagForm 
          key="tags"
          v-if="activeTab.type === 'tags' && item.type === 'tags'"
          :name="activeTab.name"
          :projectName="activeProject"
        />
        <DiscForm
          key="discs"
          v-if="activeTab.type === 'discs' && item.type === 'discs'"
          :name="activeTab.name"
          :projectName="activeProject"
        />
        <LootTableForm
          key="loot"
          v-if="activeTab.type === 'loot' && item.type === 'loot'"
          :name="activeTab.name"
          :projectName="activeProject"
        />
        <ToolForm
          key="tools"
          v-if="activeTab.type === 'tools' && item.type === 'tools'"
          :name="activeTab.name"
          :projectName="activeProject"
        />
        <ArmorForm
          key="armor"
          v-if="activeTab.type === 'armor' && item.type === 'armor'"
          :name="activeTab.name"
          :projectName="activeProject"
        />
        <CropForm
          key="crops"
          v-if="activeTab.type === 'crops' && item.type === 'crops'"
          :name="activeTab.name"
          :projectName="activeProject"
        />
      </v-tab-item>
    </v-tabs-items>
    <v-container fluid class="text-center" v-if="!openTabs.length" style="min-height:2000px;"> 
    <h1>Editor</h1>
    <p>Select or create a new mod element using the toolbar on the left. Each mod element will open in its own tab on this page.</p>
    </v-container>
  </v-card>
</template>

<script>
import BlockForm from './forms/BlockForm'
import BiomeForm from './forms/BiomeForm'
import ItemForm from './forms/ItemForm'
import RecipeForm from './forms/RecipeForm';
import MobForm from './forms/MobForm';
import StructureForm from './forms/StructureForm.vue';
import PaintingForm from './forms/PaintingForm.vue';
import TagForm from './forms/TagForm.vue';
import DiscForm from './forms/DiscForm.vue';
import LootTableForm from './forms/LootTableForm.vue';
import ToolForm from './forms/ToolForm.vue';
import ArmorForm from './forms/ArmorForm.vue';
import CropForm from './forms/CropForm.vue';

export default {
    name: 'TabWrapper',
    activeTab: '',
    props: ['activeProject'],
    components: {
      BlockForm, 
      BiomeForm, 
      ItemForm, 
      RecipeForm, 
      MobForm, 
      StructureForm, 
      PaintingForm, 
      TagForm,
      DiscForm,
      LootTableForm,
      ToolForm,
      ArmorForm,
      CropForm
    },
    data: () => ({
        name: null,
        openTabs: [],
        activeType: '',
        activeTab: '',
        activeModel: ''
    }),
    methods: {
      setActiveTab: function (item) {
        this.activeTab = item;
        this.activeType = item.type;
      },
      closeTab: function(id) {
        this.openTabs = this.openTabs.filter(tab => tab.id !== id);
        if (this.openTabs.length > 0) {
          this.activeTab = this.openTabs[0];
          this.activeType = this.openTabs[0].type;
        }
        else {
          this.activeTab = '';
          this.activeType = '';
        }
      },
      deleteElement(args) {
      this.openTabs = this.openTabs.filter((tab) => tab.name !== args.name);

      if (this.openTabs.length > 0) {
        const lastIndex = this.openTabs.length - 1;
        this.setActiveTab(this.openTabs[lastIndex]);
        this.activeModel = lastIndex;
      }
    },
    setActiveNode(node) {
      if (node) {
        this.name = node.id;

        if (
          this.openTabs.filter((tab) => tab.id === node.id).length === 0 &&
          node.id >= 0
        ) {
          // If node not already open and node is not an "add new" node
          this.openTabs.push(node);
        }

        this.setActiveTab(node);
        this.activeModel = this.openTabs.findIndex((el) => el.id === node.id);
      }
    },
  },
  mounted() {
    this.$root.$on("node-clicked", this.setActiveNode);
    this.$root.$on("delete-element", this.deleteElement);
  },
  beforeDestroy() {
    this.$root.$off("node-clicked", this.setActiveNode);
    this.$root.$off("delete-element", this.deleteElement);
  },
}
</script>

<style>
  .fixed-tabs-bar {
    position: fixed;
    z-index: 2;
    width: calc(100% - 256px) !important;
  }
</style>